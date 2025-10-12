/**
 * This file is part of CortexAI.
 *
 * Copyright (c) 2025 Christopher Dickinson
 *
 * CortexAI is licensed under the MIT License.
 * See the LICENSE file in the project root for full license information.
 */

/**
 * Web Plugin for CortexAI
 * Provides HTTP requests, web browsing, and search capabilities
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';
import puppeteer from 'puppeteer';
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// ============ Tool 1: Web Request ============
const webRequestDefinition = {
  type: "function",
  function: {
    name: "web_request",
    description: "Make HTTP/HTTPS requests to websites and APIs for security testing, vulnerability research, and reconnaissance",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to request (e.g., 'https://example.com', 'http://target.com/api')"
        },
        method: {
          type: "string",
          enum: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
          description: "HTTP method to use"
        },
        headers: {
          type: "object",
          description: "HTTP headers as key-value pairs (e.g., {'User-Agent': 'Mozilla/5.0...', 'Authorization': 'Bearer token'})"
        },
        data: {
          type: "string",
          description: "Request body data for POST/PUT requests"
        },
        follow_redirects: {
          type: "boolean",
          description: "Whether to follow HTTP redirects (default: true)"
        }
      },
      required: ["url"]
    }
  }
};

async function webRequestHandler(args) {
  const { url, method = 'GET', headers = {}, data = null, follow_redirects = true } = args;
  
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const httpModule = isHttps ? https : http;
      
      const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        ...headers
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        defaultHeaders['Content-Length'] = Buffer.byteLength(data);
        if (!defaultHeaders['Content-Type']) {
          defaultHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
        }
      }

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: defaultHeaders,
        timeout: 30000,
        rejectUnauthorized: false
      };

      const req = httpModule.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          const result = {
            success: true,
            status_code: res.statusCode,
            status_message: res.statusMessage,
            headers: res.headers,
            body: responseData,
            url: url,
            method: method,
            redirected: false
          };

          if (follow_redirects && [301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
            const redirectUrl = new URL(res.headers.location, url).href;
            result.redirected = true;
            result.redirect_url = redirectUrl;
          }

          resolve(JSON.stringify(result));
        });
      });

      req.on('error', (error) => {
        resolve(JSON.stringify({
          success: false,
          error: error.message,
          url: url,
          method: method
        }));
      });

      req.on('timeout', () => {
        req.destroy();
        resolve(JSON.stringify({
          success: false,
          error: 'Request timeout (30s)',
          url: url,
          method: method
        }));
      });

      if (data) {
        req.write(data);
      }

      req.end();
    } catch (error) {
      resolve(JSON.stringify({
        success: false,
        error: error.message,
        url: url,
        method: method
      }));
    }
  });
}

// ============ Tool 2: Browse Website ============
const browseWebsiteDefinition = {
  type: "function",
  function: {
    name: "browse_website",
    description: "Browse and extract content from websites for security analysis, documentation research, and target reconnaissance",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "Website URL to browse and analyze"
        },
        extract_links: {
          type: "boolean",
          description: "Extract all links from the page (useful for site mapping)"
        },
        extract_forms: {
          type: "boolean",
          description: "Extract HTML forms for security analysis"
        },
        extract_scripts: {
          type: "boolean",
          description: "Extract JavaScript references"
        },
        user_agent: {
          type: "string",
          description: "Custom User-Agent string for the request"
        }
      },
      required: ["url"]
    }
  }
};

async function browseWebsiteHandler(args) {
  const { url, extract_links = false, extract_forms = false, extract_scripts = false, user_agent = null } = args;
  
  try {
    return await browseWithPuppeteer(url, extract_links, extract_forms, extract_scripts, user_agent);
  } catch (puppeteerError) {
    console.log(`Puppeteer failed, falling back to static parsing: ${puppeteerError.message}`);
    return await browseStatic(url, extract_links, extract_forms, extract_scripts, user_agent);
  }
}

async function browseWithPuppeteer(url, extractLinks, extractForms, extractScripts, userAgent) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-default-apps'
      ]
    });

    const page = await browser.newPage();
    if (userAgent) await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1366, height: 768 });
    page.setDefaultTimeout(60000);

    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    const htmlContent = await page.content();
    const status = response.status();
    const headers = response.headers();

    const result = {
      success: true,
      url: url,
      status_code: status,
      headers: headers,
      content_length: htmlContent.length,
      title: await page.title().catch(() => ""),
      text_content: await page.evaluate(() => document.body.innerText.substring(0, 2000)).catch(() => ""),
      links: [],
      forms: [],
      scripts: [],
      meta_tags: [],
      security_headers: {},
      rendered_with: "puppeteer"
    };

    if (extractLinks) {
      result.links = await page.evaluate(() => {
        const linkElements = [];
        document.querySelectorAll('a[href]').forEach(link => {
          linkElements.push({
            type: 'link',
            url: link.href,
            text: link.textContent.trim(),
            relative: link.getAttribute('href'),
            visible: link.offsetParent !== null
          });
        });
        document.querySelectorAll('button').forEach(button => {
          linkElements.push({
            type: 'button',
            onclick: button.getAttribute('onclick'),
            data_url: button.getAttribute('data-url') || button.getAttribute('data-href'),
            text: button.textContent.trim(),
            class: button.className,
            visible: button.offsetParent !== null,
            id: button.id
          });
        });
        return linkElements;
      }).catch(() => []);
    }

    if (extractForms) {
      result.forms = await page.evaluate(() => {
        const formElements = [];
        document.querySelectorAll('form').forEach(form => {
          const inputs = [];
          form.querySelectorAll('input, textarea, select').forEach(input => {
            inputs.push({
              name: input.name,
              type: input.type || input.tagName.toLowerCase(),
              value: input.value,
              id: input.id,
              placeholder: input.placeholder,
              required: input.required,
              visible: input.offsetParent !== null
            });
          });
          formElements.push({
            action: form.action,
            method: form.method.toUpperCase() || 'GET',
            inputs: inputs,
            id: form.id,
            class: form.className,
            visible: form.offsetParent !== null
          });
        });
        return formElements;
      }).catch(() => []);
    }

    if (extractScripts) {
      result.scripts = await page.evaluate(() => {
        const scriptElements = [];
        document.querySelectorAll('script[src]').forEach(script => {
          scriptElements.push({
            type: 'external',
            url: script.src,
            relative: script.getAttribute('src')
          });
        });
        return scriptElements;
      }).catch(() => []);
    }

    result.meta_tags = await page.evaluate(() => {
      const tags = [];
      document.querySelectorAll('meta').forEach(meta => {
        const name = meta.getAttribute('name') || meta.getAttribute('property');
        const content = meta.getAttribute('content');
        if (name && content) {
          tags.push({ name, content, type: meta.getAttribute('name') ? 'name' : 'property' });
        }
      });
      return tags;
    }).catch(() => []);

    const securityHeaders = ['strict-transport-security', 'content-security-policy', 'x-frame-options', 'x-content-type-options', 'x-xss-protection', 'referrer-policy'];
    for (const header of securityHeaders) {
      if (headers[header]) result.security_headers[header] = headers[header];
    }

    await browser.close();
    return JSON.stringify(result);

  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}

async function browseStatic(url, extractLinks, extractForms, extractScripts, userAgent) {
  const headers = userAgent ? { 'User-Agent': userAgent } : {};
  const response = await webRequestHandler({ url, method: 'GET', headers });
  const responseData = JSON.parse(response);

  if (!responseData.success) {
    return JSON.stringify({ success: false, error: responseData.error, url });
  }

  const htmlContent = responseData.body;
  const result = {
    success: true,
    url,
    status_code: responseData.status_code,
    headers: responseData.headers,
    content_length: htmlContent.length,
    title: "",
    text_content: "",
    links: [],
    forms: [],
    scripts: [],
    meta_tags: [],
    security_headers: {},
    rendered_with: "static"
  };

  const titleMatch = htmlContent.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) result.title = titleMatch[1].trim();

  result.text_content = htmlContent
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 2000);

  if (extractLinks) result.links = extractLinksFromHTML(htmlContent, url);
  if (extractForms) result.forms = extractFormsFromHTML(htmlContent, url);
  if (extractScripts) result.scripts = extractScriptsFromHTML(htmlContent, url);
  result.meta_tags = extractMetaTagsFromHTML(htmlContent);

  const securityHeaders = ['strict-transport-security', 'content-security-policy', 'x-frame-options', 'x-content-type-options', 'x-xss-protection', 'referrer-policy'];
  for (const header of securityHeaders) {
    if (responseData.headers[header]) result.security_headers[header] = responseData.headers[header];
  }

  return JSON.stringify(result);
}

// Helper functions
function extractLinksFromHTML(htmlContent, url) {
  const links = [];
  const linkMatches = htmlContent.match(/<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi) || [];
  for (const match of linkMatches) {
    const hrefMatch = match.match(/href=["']([^"']+)["']/i);
    const textMatch = match.match(/>([^<]*)<\/a>/i);
    if (hrefMatch) {
      try {
        links.push({
          type: 'link',
          url: new URL(hrefMatch[1], url).href,
          text: textMatch ? textMatch[1].trim() : '',
          relative: hrefMatch[1]
        });
      } catch (e) {
        links.push({
          type: 'link',
          url: hrefMatch[1],
          text: textMatch ? textMatch[1].trim() : '',
          relative: hrefMatch[1],
          invalid_url: true
        });
      }
    }
  }
  return links;
}

function extractFormsFromHTML(htmlContent, url) {
  const forms = [];
  const formMatches = htmlContent.match(/<form[^>]*>[\s\S]*?<\/form>/gi) || [];
  for (const formMatch of formMatches) {
    const actionMatch = formMatch.match(/action=["']([^"']*)["']/i);
    const methodMatch = formMatch.match(/method=["']([^"']*)["']/i);
    const inputMatches = formMatch.match(/<input[^>]*>/gi) || [];
    
    const inputs = inputMatches.map(input => {
      const nameMatch = input.match(/name=["']([^"']*)["']/i);
      const typeMatch = input.match(/type=["']([^"']*)["']/i);
      const valueMatch = input.match(/value=["']([^"']*)["']/i);
      return {
        name: nameMatch ? nameMatch[1] : '',
        type: typeMatch ? typeMatch[1] : 'text',
        value: valueMatch ? valueMatch[1] : ''
      };
    });

    forms.push({
      action: actionMatch ? actionMatch[1] : '',
      method: methodMatch ? methodMatch[1].toUpperCase() : 'GET',
      inputs: inputs
    });
  }
  return forms;
}

function extractScriptsFromHTML(htmlContent, url) {
  const scripts = [];
  const scriptMatches = htmlContent.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
  for (const match of scriptMatches) {
    const srcMatch = match.match(/src=["']([^"']+)["']/i);
    if (srcMatch) {
      try {
        scripts.push({
          type: 'external',
          url: new URL(srcMatch[1], url).href,
          relative: srcMatch[1]
        });
      } catch (e) {
        scripts.push({
          type: 'external',
          url: srcMatch[1],
          relative: srcMatch[1],
          invalid_url: true
        });
      }
    }
  }
  return scripts;
}

function extractMetaTagsFromHTML(htmlContent) {
  const metaTags = [];
  const metaMatches = htmlContent.match(/<meta[^>]*>/gi) || [];
  for (const meta of metaMatches) {
    const nameMatch = meta.match(/name=["']([^"']*)["']/i);
    const contentMatch = meta.match(/content=["']([^"']*)["']/i);
    const propertyMatch = meta.match(/property=["']([^"']*)["']/i);
    if ((nameMatch || propertyMatch) && contentMatch) {
      metaTags.push({
        name: nameMatch ? nameMatch[1] : propertyMatch[1],
        content: contentMatch[1],
        type: nameMatch ? 'name' : 'property'
      });
    }
  }
  return metaTags;
}

// ============ Tool 3: Web Search ============
const webSearchDefinition = {
  type: "function",
  function: {
    name: "web_search",
    description: "Search the web using DuckDuckGo for vulnerability research, CVE information, security tools, and threat intelligence",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (e.g., 'CVE-2024-1234', 'Apache log4j vulnerability', 'SQL injection techniques')"
        },
        num_results: {
          type: "number",
          description: "Number of search results to return (default: 10, max: 20)"
        }
      },
      required: ["query"]
    }
  }
};

async function webSearchHandler(args) {
  try {
    const { query, num_results = 10 } = args;
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    
    const response = await webRequestHandler({ url: searchUrl });
    const responseData = JSON.parse(response);
    
    if (!responseData.success) {
      return JSON.stringify({ success: false, error: "Failed to perform web search", query });
    }

    const searchData = JSON.parse(responseData.body);
    const results = [];
    
    if (searchData.Abstract) {
      results.push({
        title: searchData.Heading || "Instant Answer",
        snippet: searchData.Abstract,
        url: searchData.AbstractURL,
        type: "instant_answer"
      });
    }

    if (searchData.RelatedTopics) {
      for (const topic of searchData.RelatedTopics.slice(0, num_results - results.length)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || "Related Topic",
            snippet: topic.Text,
            url: topic.FirstURL,
            type: "related_topic"
          });
        }
      }
    }

    if (results.length < 3) {
      try {
        const curlCommand = `curl -s "https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}" | grep -o '<a href="[^"]*"[^>]*>[^<]*</a>' | head -${num_results}`;
        const { stdout } = await execAsync(curlCommand);
        
        if (stdout) {
          const linkMatches = stdout.match(/<a href="([^"]*)"[^>]*>([^<]*)<\/a>/g) || [];
          for (const match of linkMatches) {
            const urlMatch = match.match(/href="([^"]*)"/);
            const titleMatch = match.match(/>([^<]*)</);
            if (urlMatch && titleMatch) {
              results.push({
                title: titleMatch[1].trim(),
                snippet: "Search result",
                url: urlMatch[1],
                type: "web_result"
              });
            }
          }
        }
      } catch (curlError) {
        // Continue with what we have
      }
    }

    return JSON.stringify({
      success: true,
      query: query,
      results: results.slice(0, num_results),
      total_results: results.length
    });

  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message,
      query: args.query
    });
  }
}

// ============ Plugin Initialization ============
export async function init(toolRegistry) {
  toolRegistry.register(webRequestDefinition, webRequestHandler);
  toolRegistry.register(browseWebsiteDefinition, browseWebsiteHandler);
  toolRegistry.register(webSearchDefinition, webSearchHandler);
  
  console.log("   🌐 Web plugin initialized");
}
