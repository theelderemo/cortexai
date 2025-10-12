import { URL } from 'url';
import ipaddr from 'ipaddr.js';
import cidrRegex from 'cidr-regex';

/**
 * Target Scoping and Site Mapping Engine
 * Handles scope definition, validation, and hierarchical site mapping
 */
export class ScopeManager {
  constructor(projectManager) {
    this.projectManager = projectManager;
    this.siteMap = new Map(); // URL -> site data
    this.hierarchy = new Map(); // parent URL -> children URLs
  }

  /**
   * Add scope rule to current project
   */
  async addScopeRule(ruleType, patternType, pattern, description = '') {
    const db = this.projectManager.getDatabase();
    if (!db) {
      throw new Error('No project loaded');
    }

    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO scope_rules (rule_type, pattern_type, pattern, description)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run([ruleType, patternType, pattern, description], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ Added ${ruleType} rule: ${pattern}`);
          resolve({ id: this.lastID, ruleType, patternType, pattern });
        }
      });
      
      stmt.finalize();
    });
  }

  /**
   * Get all scope rules for current project
   */
  async getScopeRules() {
    const db = this.projectManager.getDatabase();
    if (!db) {
      throw new Error('No project loaded');
    }

    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM scope_rules 
        WHERE active = 1 
        ORDER BY rule_type, pattern_type, created_at
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Check if a URL is in scope
   */
  async isInScope(urlString) {
    try {
      const url = new URL(urlString);
      const rules = await this.getScopeRules();
      
      let inScope = false;
      let explicitlyExcluded = false;
      
      for (const rule of rules) {
        const matches = await this.matchesPattern(urlString, rule.pattern_type, rule.pattern);
        
        if (matches) {
          if (rule.rule_type === 'include') {
            inScope = true;
          } else if (rule.rule_type === 'exclude') {
            explicitlyExcluded = true;
            break; // Explicit exclusions take precedence
          }
        }
      }
      
      return inScope && !explicitlyExcluded;
    } catch (error) {
      console.error('❌ Error checking scope:', error.message);
      return false;
    }
  }

  /**
   * Check if a URL matches a pattern
   */
  async matchesPattern(urlString, patternType, pattern) {
    try {
      switch (patternType) {
        case 'url':
          // Simple URL pattern matching with wildcards
          const urlPattern = pattern.replace(/\*/g, '.*');
          const regex = new RegExp('^' + urlPattern + '$', 'i');
          return regex.test(urlString);
          
        case 'regex':
          const userRegex = new RegExp(pattern, 'i');
          return userRegex.test(urlString);
          
        case 'cidr':
          try {
            const url = new URL(urlString);
            const hostname = url.hostname;
            
            // Check if hostname is an IP address
            if (ipaddr.isValid(hostname)) {
              const addr = ipaddr.process(hostname);
              const cidr = ipaddr.process(pattern);
              return addr.match(cidr);
            }
            return false;
          } catch (e) {
            return false;
          }
          
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Add discovered site to site map
   */
  async addSite(siteData) {
    const db = this.projectManager.getDatabase();
    if (!db) {
      throw new Error('No project loaded');
    }

    // Check if site is in scope
    const inScope = await this.isInScope(siteData.url);
    
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO sites 
        (url, title, status_code, content_type, content_length, response_headers, 
         in_scope, asset_type, parent_id, last_checked)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      
      const headerJson = siteData.headers ? JSON.stringify(siteData.headers) : null;
      
      stmt.run([
        siteData.url,
        siteData.title || null,
        siteData.statusCode || null,
        siteData.contentType || null,
        siteData.contentLength || null,
        headerJson,
        inScope ? 1 : 0,
        siteData.assetType || 'page',
        siteData.parentId || null
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          // Update local site map
          const site = {
            id: this.lastID,
            ...siteData,
            inScope,
            discoveredAt: new Date()
          };
          
          resolve(site);
        }
      });
      
      stmt.finalize();
    });
  }

  /**
   * Get hierarchical site map
   */
  async getSiteMap() {
    const db = this.projectManager.getDatabase();
    if (!db) {
      throw new Error('No project loaded');
    }

    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM sites 
        ORDER BY url
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Build hierarchy
          const siteMap = this.buildHierarchy(rows);
          resolve(siteMap);
        }
      });
    });
  }

  /**
   * Build hierarchical site structure
   */
  buildHierarchy(sites) {
    const siteMap = {
      domains: new Map(),
      totalSites: sites.length,
      inScope: sites.filter(s => s.in_scope).length,
      outOfScope: sites.filter(s => !s.in_scope).length
    };

    for (const site of sites) {
      try {
        const url = new URL(site.url);
        const domain = url.hostname;
        
        if (!siteMap.domains.has(domain)) {
          siteMap.domains.set(domain, {
            domain,
            pages: [],
            apis: [],
            directories: new Set(),
            totalAssets: 0,
            inScopeAssets: 0
          });
        }
        
        const domainData = siteMap.domains.get(domain);
        domainData.totalAssets++;
        
        if (site.in_scope) {
          domainData.inScopeAssets++;
        }
        
        // Categorize by asset type
        if (site.asset_type === 'api' || url.pathname.includes('/api/')) {
          domainData.apis.push(site);
        } else {
          domainData.pages.push(site);
        }
        
        // Track directories
        const pathParts = url.pathname.split('/').filter(p => p);
        let currentPath = '';
        for (const part of pathParts.slice(0, -1)) {
          currentPath += '/' + part;
          domainData.directories.add(currentPath);
        }
        
      } catch (error) {
        console.error('Error processing site URL:', site.url, error.message);
      }
    }
    
    // Convert directories Set to Array for JSON serialization
    for (const [domain, data] of siteMap.domains) {
      data.directories = Array.from(data.directories).sort();
    }
    
    return siteMap;
  }

  /**
   * Discover assets from traffic (passive)
   */
  async discoverFromTraffic(requestData) {
    try {
      const { url, method, headers, response } = requestData;
      
      // Basic site data
      const siteData = {
        url: url,
        statusCode: response?.statusCode,
        contentType: response?.headers?.['content-type'],
        contentLength: response?.headers?.['content-length'],
        headers: response?.headers,
        assetType: this.detectAssetType(url, response?.headers)
      };
      
      // Add to site map
      const site = await this.addSite(siteData);
      
      // Extract additional URLs from response body if HTML
      if (response?.body && response?.headers?.['content-type']?.includes('text/html')) {
        const extractedUrls = this.extractUrlsFromHtml(response.body, url);
        
        for (const extractedUrl of extractedUrls) {
          const childSiteData = {
            url: extractedUrl,
            assetType: this.detectAssetType(extractedUrl),
            parentId: site.id
          };
          
          await this.addSite(childSiteData);
        }
      }
      
      return site;
    } catch (error) {
      console.error('❌ Error discovering from traffic:', error.message);
      return null;
    }
  }

  /**
   * Active discovery (crawling/spidering)
   */
  async activeDiscovery(startUrl, options = {}) {
    const maxDepth = options.maxDepth || 3;
    const delay = options.delay || 1000;
    const discovered = new Set();
    const queue = [{ url: startUrl, depth: 0 }];
    
    console.log(`🕷️  Starting active discovery from: ${startUrl}`);
    console.log(`   Max depth: ${maxDepth}`);
    
    while (queue.length > 0) {
      const { url, depth } = queue.shift();
      
      if (discovered.has(url) || depth > maxDepth) {
        continue;
      }
      
      if (!(await this.isInScope(url))) {
        console.log(`⏭️  Skipping out-of-scope URL: ${url}`);
        continue;
      }
      
      discovered.add(url);
      
      try {
        console.log(`🔍 Crawling [depth ${depth}]: ${url}`);
        
        // Make request using the web_request tool from agent
        const response = await this.makeWebRequest(url);
        
        if (response.success) {
          // Add site to map
          const siteData = {
            url: url,
            title: this.extractTitle(response.body),
            statusCode: response.status_code,
            contentType: response.headers?.['content-type'],
            contentLength: response.body?.length,
            headers: response.headers,
            assetType: this.detectAssetType(url, response.headers)
          };
          
          await this.addSite(siteData);
          
          // Extract more URLs if HTML
          if (response.headers?.['content-type']?.includes('text/html')) {
            const extractedUrls = this.extractUrlsFromHtml(response.body, url);
            
            for (const extractedUrl of extractedUrls) {
              if (!discovered.has(extractedUrl)) {
                queue.push({ url: extractedUrl, depth: depth + 1 });
              }
            }
          }
        }
        
        // Rate limiting
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
      } catch (error) {
        console.error(`❌ Error crawling ${url}:`, error.message);
      }
    }
    
    console.log(`✅ Active discovery completed. Found ${discovered.size} assets.`);
    return Array.from(discovered);
  }

  /**
   * Content discovery (dirb/gobuster style)
   */
  async contentDiscovery(baseUrl, wordlist = null) {
    const defaultWordlist = [
      'admin', 'administrator', 'api', 'app', 'application', 'backup', 'config',
      'data', 'db', 'dev', 'docs', 'download', 'file', 'files', 'image', 'images',
      'include', 'js', 'lib', 'log', 'logs', 'old', 'php', 'script', 'scripts',
      'src', 'static', 'temp', 'test', 'tmp', 'upload', 'uploads', 'user', 'users',
      'web', 'www', '.env', '.git', 'robots.txt', 'sitemap.xml', 'crossdomain.xml',
      'favicon.ico', 'manifest.json', '.htaccess', 'web.config', 'composer.json',
      'package.json', 'yarn.lock', 'Dockerfile', '.dockerignore', 'docker-compose.yml'
    ];
    
    const words = wordlist || defaultWordlist;
    const discovered = [];
    
    console.log(`📁 Starting content discovery on: ${baseUrl}`);
    console.log(`   Testing ${words.length} paths...`);
    
    for (const word of words) {
      const testUrl = `${baseUrl.replace(/\/$/, '')}/${word}`;
      
      try {
        const response = await this.makeWebRequest(testUrl);
        
        if (response.success && response.status_code < 400) {
          console.log(`✅ Found: ${testUrl} (${response.status_code})`);
          
          const siteData = {
            url: testUrl,
            statusCode: response.status_code,
            contentType: response.headers?.['content-type'],
            contentLength: response.body?.length,
            headers: response.headers,
            assetType: this.detectAssetType(testUrl, response.headers)
          };
          
          const site = await this.addSite(siteData);
          discovered.push(site);
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        // Ignore errors for content discovery
      }
    }
    
    console.log(`✅ Content discovery completed. Found ${discovered.length} new assets.`);
    return discovered;
  }

  /**
   * Detect asset type based on URL and headers
   */
  detectAssetType(url, headers = {}) {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname.toLowerCase();
      const contentType = headers?.['content-type']?.toLowerCase() || '';
      
      // API endpoints
      if (path.includes('/api/') || path.includes('/v1/') || path.includes('/v2/') ||
          contentType.includes('json') || contentType.includes('xml')) {
        return 'api';
      }
      
      // Static resources
      if (path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|pdf)$/)) {
        return 'static';
      }
      
      // Configuration files
      if (path.match(/\.(xml|json|yaml|yml|conf|config|env)$/)) {
        return 'config';
      }
      
      // Directories
      if (path.endsWith('/')) {
        return 'directory';
      }
      
      return 'page';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Extract title from HTML
   */
  extractTitle(html) {
    if (!html) return null;
    
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : null;
  }

  /**
   * Extract URLs from HTML content
   */
  extractUrlsFromHtml(html, baseUrl) {
    if (!html) return [];
    
    const urls = new Set();
    const base = new URL(baseUrl);
    
    // Extract href attributes
    const hrefMatches = html.match(/href=["']([^"']+)["']/gi) || [];
    
    // Extract src attributes
    const srcMatches = html.match(/src=["']([^"']+)["']/gi) || [];
    
    // Extract action attributes
    const actionMatches = html.match(/action=["']([^"']+)["']/gi) || [];
    
    const allMatches = [...hrefMatches, ...srcMatches, ...actionMatches];
    
    for (const match of allMatches) {
      try {
        const urlMatch = match.match(/=["']([^"']+)["']/);
        if (urlMatch && urlMatch[1]) {
          const url = new URL(urlMatch[1], baseUrl).href;
          
          // Filter out unwanted URLs
          if (!url.includes('javascript:') && 
              !url.includes('mailto:') && 
              !url.includes('tel:') &&
              !url.includes('#')) {
            urls.add(url);
          }
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }
    
    return Array.from(urls);
  }

  /**
   * Make web request (wrapper for agent's web_request tool)
   */
  async makeWebRequest(url, options = {}) {
    // This would be called from the main agent context
    // For now, return a mock response structure
    return {
      success: true,
      status_code: 200,
      headers: { 'content-type': 'text/html' },
      body: ''
    };
  }

  /**
   * Export scope configuration
   */
  async exportScope() {
    const rules = await this.getScopeRules();
    const siteMap = await this.getSiteMap();
    
    return {
      scope_rules: rules,
      site_map: siteMap,
      exported_at: new Date().toISOString()
    };
  }

  /**
   * Import scope configuration
   */
  async importScope(scopeData) {
    if (!scopeData.scope_rules) {
      throw new Error('Invalid scope data: missing scope_rules');
    }
    
    for (const rule of scopeData.scope_rules) {
      await this.addScopeRule(
        rule.rule_type,
        rule.pattern_type,
        rule.pattern,
        rule.description
      );
    }
    
    console.log(`✅ Imported ${scopeData.scope_rules.length} scope rules`);
  }
}