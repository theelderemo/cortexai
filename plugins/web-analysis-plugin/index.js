/**
 * This file is part of CortexAI.
 *
 * Copyright (c) 2025 Christopher Dickinson
 *
 * CortexAI is licensed under the MIT License.
 * See the LICENSE file in the project root for full license information.
 */

/**
 * Web Analysis Plugin for CortexAI
 * Advanced JavaScript analysis and API endpoint probing
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';

// Helper function for web requests
async function makeWebRequest(url, method = 'GET', headers = {}) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const httpModule = isHttps ? https : http;
      
      const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        ...headers
      };

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
        res.on('data', (chunk) => { responseData += chunk; });
        res.on('end', () => {
          resolve(JSON.stringify({
            success: true,
            status_code: res.statusCode,
            headers: res.headers,
            body: responseData
          }));
        });
      });

      req.on('error', (error) => {
        resolve(JSON.stringify({ success: false, error: error.message }));
      });

      req.on('timeout', () => {
        req.destroy();
        resolve(JSON.stringify({ success: false, error: 'Request timeout' }));
      });

      req.end();
    } catch (error) {
      resolve(JSON.stringify({ success: false, error: error.message }));
    }
  });
}

// ============ Tool 1: Analyze JavaScript ============
const analyzeJavaScriptDefinition = {
  type: "function",
  function: {
    name: "analyze_javascript",
    description: "Download and analyze JavaScript files for API endpoints, AJAX calls, and network requests",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string", 
          description: "Base URL to analyze for JavaScript files"
        },
        search_patterns: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Regex patterns to search for (default: API patterns)"
        }
      },
      required: ["url"]
    }
  }
};

async function analyzeJavaScriptHandler(args) {
  try {
    const { url, search_patterns = null } = args;
    
    const defaultPatterns = [
      /\/api\/[^\s"']+/g,
      /https?:\/\/[^\s"']*api[^\s"']*/g,
      /fetch\s*\(\s*['"](.*?)['"][^)]*\)/g,
      /axios\.(get|post|put|delete)\s*\(\s*['"](.*?)['"][^)]*\)/g,
      /\$\.ajax\s*\(\s*{[^}]*url\s*:\s*['"](.*?)['"][^}]*}/g,
      /XMLHttpRequest[^;]*\.open\s*\(\s*[^,]*,\s*['"](.*?)['"][^)]*\)/g,
      /graphql|gql/gi,
      /websocket|ws:/gi
    ];

    const patterns = search_patterns || defaultPatterns;
    
    const response = await makeWebRequest(url);
    const responseData = JSON.parse(response);
    
    if (!responseData.success) {
      return JSON.stringify({
        success: false,
        error: "Failed to fetch main page",
        url: url
      });
    }

    const htmlContent = responseData.body;
    const foundEndpoints = new Set();
    const jsFiles = [];
    
    // Extract all script sources
    const scriptMatches = htmlContent.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
    for (const match of scriptMatches) {
      const srcMatch = match.match(/src=["']([^"']+)["']/i);
      if (srcMatch) {
        try {
          const scriptUrl = new URL(srcMatch[1], url).href;
          jsFiles.push(scriptUrl);
        } catch (e) {
          jsFiles.push(srcMatch[1]);
        }
      }
    }

    // Analyze inline scripts in HTML
    const inlineScripts = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (const script of inlineScripts) {
      const content = script.replace(/<\/?script[^>]*>/gi, '');
      for (const pattern of patterns) {
        const matches = content.match(pattern) || [];
        matches.forEach(match => foundEndpoints.add(match));
      }
    }

    // Download and analyze external JS files
    const jsAnalysis = [];
    for (const jsFile of jsFiles.slice(0, 10)) {
      try {
        const jsResponse = await makeWebRequest(jsFile);
        const jsData = JSON.parse(jsResponse);
        
        if (jsData.success) {
          const jsContent = jsData.body;
          const fileEndpoints = new Set();
          
          for (const pattern of patterns) {
            const matches = jsContent.match(pattern) || [];
            matches.forEach(match => {
              foundEndpoints.add(match);
              fileEndpoints.add(match);
            });
          }
          
          jsAnalysis.push({
            file: jsFile,
            size: jsContent.length,
            endpoints_found: Array.from(fileEndpoints),
            contains_api_calls: fileEndpoints.size > 0
          });
        }
      } catch (error) {
        jsAnalysis.push({
          file: jsFile,
          error: error.message
        });
      }
    }

    return JSON.stringify({
      success: true,
      url: url,
      total_endpoints_found: foundEndpoints.size,
      endpoints: Array.from(foundEndpoints),
      js_files_analyzed: jsAnalysis.length,
      js_files: jsAnalysis,
      patterns_used: patterns.map(p => p.toString ? p.toString() : p)
    });

  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message,
      url: args.url
    });
  }
}

// ============ Tool 2: Probe API Endpoints ============
const probeApiEndpointsDefinition = {
  type: "function",
  function: {
    name: "probe_api_endpoints",
    description: "Systematically probe for common API endpoint patterns and paths",
    parameters: {
      type: "object", 
      properties: {
        base_url: {
          type: "string",
          description: "Base URL to probe for API endpoints"
        },
        paths: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Custom paths to test (optional)"
        }
      },
      required: ["base_url"]
    }
  }
};

async function probeApiEndpointsHandler(args) {
  try {
    const { base_url, paths = null } = args;
    const urlObj = new URL(base_url);
    const baseDomain = `${urlObj.protocol}//${urlObj.host}`;
    
    const commonPaths = paths || [
      '/api',
      '/api/v1',
      '/api/v2', 
      '/v1',
      '/v2',
      '/graphql',
      '/gql',
      '/rest',
      '/api/rest',
      '/api/graphql',
      '/api/users',
      '/api/auth',
      '/api/login',
      '/api/data',
      '/api/search',
      '/api/public',
      '/endpoints',
      '/swagger',
      '/docs',
      '/openapi.json',
      '/api-docs',
      '/.well-known/openapi_description'
    ];

    const results = [];
    
    for (const path of commonPaths) {
      const testUrl = `${baseDomain}${path}`;
      
      try {
        const response = await makeWebRequest(testUrl, 'GET');
        const responseData = JSON.parse(response);
        
        results.push({
          url: testUrl,
          status_code: responseData.status_code || 'error',
          accessible: responseData.success && responseData.status_code < 400,
          content_type: responseData.headers?.['content-type'] || 'unknown',
          response_size: responseData.body?.length || 0,
          likely_api: (responseData.body?.includes('{"') || 
                      responseData.body?.includes('[{') ||
                      responseData.headers?.['content-type']?.includes('json') ||
                      responseData.headers?.['content-type']?.includes('xml'))
        });
        
      } catch (error) {
        results.push({
          url: testUrl,
          error: error.message,
          accessible: false
        });
      }
    }

    const accessibleEndpoints = results.filter(r => r.accessible);
    const likelyApiEndpoints = results.filter(r => r.likely_api);

    return JSON.stringify({
      success: true,
      base_url: base_url,
      total_paths_tested: results.length,
      accessible_endpoints: accessibleEndpoints.length,
      likely_api_endpoints: likelyApiEndpoints.length,
      results: results,
      summary: {
        accessible: accessibleEndpoints.map(r => r.url),
        likely_apis: likelyApiEndpoints.map(r => r.url)
      }
    });

  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message,
      base_url: args.base_url
    });
  }
}

// ============ Plugin Initialization ============
export async function init(toolRegistry) {
  toolRegistry.register(analyzeJavaScriptDefinition, analyzeJavaScriptHandler);
  toolRegistry.register(probeApiEndpointsDefinition, probeApiEndpointsHandler);
  
  console.log("   🔍 Web analysis plugin initialized");
}
