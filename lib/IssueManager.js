import { v4 as uuidv4 } from 'uuid';

/**
 * Centralized Issue Management System
 * Handles vulnerability tracking, evidence storage, and issue lifecycle
 */
export class IssueManager {
  constructor(projectManager) {
    this.projectManager = projectManager;
    this.severityLevels = ['Critical', 'High', 'Medium', 'Low', 'Info'];
    this.statusTypes = ['New', 'Confirmed', 'False Positive', 'Remediated', 'Risk Accepted'];
  }

  /**
   * Log a new vulnerability
   */
  async logVulnerability(vulnerabilityData) {
    const db = this.projectManager.getDatabase();
    if (!db) {
      throw new Error('No project loaded');
    }

    // Validate severity
    if (!this.severityLevels.includes(vulnerabilityData.severity)) {
      throw new Error(`Invalid severity. Must be one of: ${this.severityLevels.join(', ')}`);
    }

    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO vulnerabilities 
        (title, description, severity, cwe_id, owasp_category, url, parameter, 
         payload, evidence, remediation, status, site_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        vulnerabilityData.title,
        vulnerabilityData.description || null,
        vulnerabilityData.severity,
        vulnerabilityData.cwe_id || null,
        vulnerabilityData.owasp_category || null,
        vulnerabilityData.url || null,
        vulnerabilityData.parameter || null,
        vulnerabilityData.payload || null,
        vulnerabilityData.evidence || null,
        vulnerabilityData.remediation || null,
        vulnerabilityData.status || 'New',
        vulnerabilityData.site_id || null
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          const vulnerability = {
            id: this.lastID,
            ...vulnerabilityData,
            discovered_at: new Date().toISOString()
          };
          
          console.log(`🚨 Logged ${vulnerabilityData.severity} vulnerability: ${vulnerabilityData.title}`);
          resolve(vulnerability);
        }
      });
      
      stmt.finalize();
    });
  }

  /**
   * Update vulnerability status
   */
  async updateVulnerabilityStatus(vulnId, newStatus, notes = null) {
    const db = this.projectManager.getDatabase();
    if (!db) {
      throw new Error('No project loaded');
    }

    if (!this.statusTypes.includes(newStatus)) {
      throw new Error(`Invalid status. Must be one of: ${this.statusTypes.join(', ')}`);
    }

    return new Promise((resolve, reject) => {
      const updateSql = notes ? 
        'UPDATE vulnerabilities SET status = ?, evidence = evidence || ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?' :
        'UPDATE vulnerabilities SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      
      const params = notes ? [newStatus, `\n\nStatus Update: ${notes}`, vulnId] : [newStatus, vulnId];
      
      db.run(updateSql, params, function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error(`Vulnerability with ID ${vulnId} not found`));
        } else {
          console.log(`✅ Updated vulnerability ${vulnId} status to: ${newStatus}`);
          resolve({ id: vulnId, status: newStatus, updated: true });
        }
      });
    });
  }

  /**
   * Get all vulnerabilities with optional filtering
   */
  async getVulnerabilities(filters = {}) {
    const db = this.projectManager.getDatabase();
    if (!db) {
      throw new Error('No project loaded');
    }

    let sql = `
      SELECT v.*, s.url as site_url, s.title as site_title
      FROM vulnerabilities v
      LEFT JOIN sites s ON v.site_id = s.id
    `;
    
    const conditions = [];
    const params = [];

    if (filters.severity) {
      conditions.push('v.severity = ?');
      params.push(filters.severity);
    }

    if (filters.status) {
      conditions.push('v.status = ?');
      params.push(filters.status);
    }

    if (filters.cwe_id) {
      conditions.push('v.cwe_id = ?');
      params.push(filters.cwe_id);
    }

    if (filters.owasp_category) {
      conditions.push('v.owasp_category = ?');
      params.push(filters.owasp_category);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY CASE v.severity WHEN "Critical" THEN 1 WHEN "High" THEN 2 WHEN "Medium" THEN 3 WHEN "Low" THEN 4 ELSE 5 END, v.discovered_at DESC';

    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Get vulnerability by ID
   */
  async getVulnerability(vulnId) {
    const db = this.projectManager.getDatabase();
    if (!db) {
      throw new Error('No project loaded');
    }

    return new Promise((resolve, reject) => {
      db.get(`
        SELECT v.*, s.url as site_url, s.title as site_title
        FROM vulnerabilities v
        LEFT JOIN sites s ON v.site_id = s.id
        WHERE v.id = ?
      `, [vulnId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Store HTTP request/response evidence
   */
  async storeHttpEvidence(evidenceData) {
    const db = this.projectManager.getDatabase();
    if (!db) {
      throw new Error('No project loaded');
    }

    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO http_evidence 
        (vulnerability_id, method, url, request_headers, request_body, 
         response_headers, response_body, response_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        evidenceData.vulnerability_id,
        evidenceData.method || 'GET',
        evidenceData.url,
        JSON.stringify(evidenceData.request_headers || {}),
        evidenceData.request_body || null,
        JSON.stringify(evidenceData.response_headers || {}),
        evidenceData.response_body || null,
        evidenceData.response_code || null
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          const evidence = {
            id: this.lastID,
            ...evidenceData,
            timestamp: new Date().toISOString()
          };
          
          console.log(`📎 Stored HTTP evidence for vulnerability ${evidenceData.vulnerability_id}`);
          resolve(evidence);
        }
      });
      
      stmt.finalize();
    });
  }

  /**
   * Get HTTP evidence for a vulnerability
   */
  async getHttpEvidence(vulnId) {
    const db = this.projectManager.getDatabase();
    if (!db) {
      throw new Error('No project loaded');
    }

    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM http_evidence 
        WHERE vulnerability_id = ? 
        ORDER BY timestamp DESC
      `, [vulnId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse JSON fields
          const evidence = rows.map(row => ({
            ...row,
            request_headers: JSON.parse(row.request_headers || '{}'),
            response_headers: JSON.parse(row.response_headers || '{}')
          }));
          resolve(evidence);
        }
      });
    });
  }

  /**
   * Auto-detect and log common vulnerabilities
   */
  async autoDetectVulnerabilities(requestData, responseData) {
    const vulnerabilities = [];
    
    try {
      // SQL Injection Detection
      const sqlInjectionVuln = await this.detectSqlInjection(requestData, responseData);
      if (sqlInjectionVuln) {
        vulnerabilities.push(sqlInjectionVuln);
      }

      // XSS Detection
      const xssVuln = await this.detectXss(requestData, responseData);
      if (xssVuln) {
        vulnerabilities.push(xssVuln);
      }

      // Information Disclosure Detection
      const infoDiscVuln = await this.detectInformationDisclosure(requestData, responseData);
      if (infoDiscVuln) {
        vulnerabilities.push(infoDiscVuln);
      }

      // Security Headers Check
      const headerVuln = await this.checkSecurityHeaders(requestData, responseData);
      if (headerVuln) {
        vulnerabilities.push(headerVuln);
      }

      // Log all detected vulnerabilities
      for (const vuln of vulnerabilities) {
        await this.logVulnerability(vuln);
        
        // Store HTTP evidence
        if (requestData && responseData) {
          await this.storeHttpEvidence({
            vulnerability_id: vuln.id,
            method: requestData.method,
            url: requestData.url,
            request_headers: requestData.headers,
            request_body: requestData.body,
            response_headers: responseData.headers,
            response_body: responseData.body,
            response_code: responseData.statusCode
          });
        }
      }

      return vulnerabilities;
    } catch (error) {
      console.error('❌ Error in auto-detection:', error.message);
      return [];
    }
  }

  /**
   * Detect SQL Injection vulnerabilities
   */
  async detectSqlInjection(requestData, responseData) {
    if (!responseData?.body) return null;

    const errorPatterns = [
      /mysql_fetch_array/i,
      /ora-\d{5}/i,
      /microsoft.*odbc.*sql/i,
      /sql.*syntax.*error/i,
      /sqlite_exception/i,
      /postgresql.*error/i,
      /warning.*pg_/i,
      /valid mysql result/i,
      /mysql.*error/i,
      /\bSQL\b.*\berror\b/i
    ];

    for (const pattern of errorPatterns) {
      if (pattern.test(responseData.body)) {
        return {
          title: 'SQL Injection',
          description: 'Potential SQL injection vulnerability detected based on database error messages in response',
          severity: 'High',
          cwe_id: 'CWE-89',
          owasp_category: 'A03:2021 – Injection',
          url: requestData?.url,
          parameter: this.extractPotentialInjectionParameter(requestData),
          evidence: `Database error detected in response: ${pattern.toString()}`,
          remediation: 'Use parameterized queries/prepared statements. Validate and sanitize all user input. Implement proper error handling.'
        };
      }
    }

    return null;
  }

  /**
   * Detect XSS vulnerabilities
   */
  async detectXss(requestData, responseData) {
    if (!requestData?.body && !requestData?.url) return null;
    if (!responseData?.body) return null;

    // Check if user input is reflected in response
    const userInputs = this.extractUserInputs(requestData);
    
    for (const input of userInputs) {
      if (responseData.body.includes(input) && input.length > 3) {
        // Check if input contains potential XSS payloads
        const xssPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /<iframe/i,
          /<img.*onerror/i
        ];

        const containsXssPayload = xssPatterns.some(pattern => pattern.test(input));
        
        if (containsXssPayload || input.includes('<') || input.includes('javascript:')) {
          return {
            title: 'Cross-Site Scripting (XSS)',
            description: 'Potential XSS vulnerability detected - user input reflected in response without proper encoding',
            severity: 'Medium',
            cwe_id: 'CWE-79',
            owasp_category: 'A03:2021 – Injection',
            url: requestData?.url,
            parameter: this.extractParameterContaining(requestData, input),
            payload: input,
            evidence: `User input "${input}" reflected in response`,
            remediation: 'Implement proper output encoding/escaping. Use Content Security Policy (CSP). Validate and sanitize user input.'
          };
        }
      }
    }

    return null;
  }

  /**
   * Detect Information Disclosure
   */
  async detectInformationDisclosure(requestData, responseData) {
    if (!responseData?.body) return null;

    const sensitivePatterns = [
      {
        pattern: /password\s*[:=]\s*['"][^'"]+['"]/i,
        description: 'Password disclosed in response',
        severity: 'High'
      },
      {
        pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
        description: 'API key disclosed in response',
        severity: 'High'
      },
      {
        pattern: /secret\s*[:=]\s*['"][^'"]+['"]/i,
        description: 'Secret disclosed in response',
        severity: 'Medium'
      },
      {
        pattern: /(?:root|admin):.*?:[0-9]+:[0-9]+:/,
        description: 'Unix passwd file content detected',
        severity: 'High'
      },
      {
        pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/,
        description: 'Credit card number pattern detected',
        severity: 'High'
      },
      {
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
        description: 'Email addresses disclosed',
        severity: 'Low'
      }
    ];

    for (const { pattern, description, severity } of sensitivePatterns) {
      if (pattern.test(responseData.body)) {
        return {
          title: 'Information Disclosure',
          description: description,
          severity: severity,
          cwe_id: 'CWE-200',
          owasp_category: 'A01:2021 – Broken Access Control',
          url: requestData?.url,
          evidence: `Sensitive information pattern detected: ${pattern.toString()}`,
          remediation: 'Remove sensitive information from responses. Implement proper error handling. Review information exposure in all outputs.'
        };
      }
    }

    return null;
  }

  /**
   * Check for missing security headers
   */
  async checkSecurityHeaders(requestData, responseData) {
    if (!responseData?.headers) return null;

    const missingHeaders = [];
    const headers = Object.keys(responseData.headers).map(h => h.toLowerCase());

    const securityHeaders = {
      'strict-transport-security': 'HSTS header missing',
      'x-frame-options': 'X-Frame-Options header missing',
      'x-content-type-options': 'X-Content-Type-Options header missing',
      'x-xss-protection': 'X-XSS-Protection header missing',
      'content-security-policy': 'Content Security Policy header missing',
      'referrer-policy': 'Referrer-Policy header missing'
    };

    for (const [header, description] of Object.entries(securityHeaders)) {
      if (!headers.includes(header)) {
        missingHeaders.push(description);
      }
    }

    if (missingHeaders.length > 0) {
      return {
        title: 'Missing Security Headers',
        description: 'Security headers are missing from the response',
        severity: 'Low',
        cwe_id: 'CWE-16',
        owasp_category: 'A05:2021 – Security Misconfiguration',
        url: requestData?.url,
        evidence: missingHeaders.join(', '),
        remediation: 'Implement security headers: HSTS, X-Frame-Options, X-Content-Type-Options, CSP, etc.'
      };
    }

    return null;
  }

  /**
   * Extract user inputs from request
   */
  extractUserInputs(requestData) {
    const inputs = [];
    
    // Extract from URL parameters
    if (requestData.url) {
      try {
        const url = new URL(requestData.url);
        for (const [key, value] of url.searchParams) {
          inputs.push(value);
        }
      } catch (e) {
        // Invalid URL
      }
    }

    // Extract from body (form data, JSON, etc.)
    if (requestData.body) {
      // Try to parse as JSON
      try {
        const jsonData = JSON.parse(requestData.body);
        const values = this.extractValuesFromObject(jsonData);
        inputs.push(...values);
      } catch (e) {
        // Not JSON, try URL-encoded
        if (requestData.body.includes('=')) {
          const params = new URLSearchParams(requestData.body);
          for (const [key, value] of params) {
            inputs.push(value);
          }
        } else {
          // Raw body
          inputs.push(requestData.body);
        }
      }
    }

    return inputs.filter(input => input && input.length > 0);
  }

  /**
   * Extract values from nested object
   */
  extractValuesFromObject(obj) {
    const values = [];
    
    for (const value of Object.values(obj)) {
      if (typeof value === 'string') {
        values.push(value);
      } else if (typeof value === 'object' && value !== null) {
        values.push(...this.extractValuesFromObject(value));
      }
    }
    
    return values;
  }

  /**
   * Extract potential injection parameter
   */
  extractPotentialInjectionParameter(requestData) {
    if (!requestData) return null;

    // Check URL parameters first
    if (requestData.url) {
      try {
        const url = new URL(requestData.url);
        const params = Array.from(url.searchParams.keys());
        if (params.length > 0) {
          return params[0]; // Return first parameter as likely candidate
        }
      } catch (e) {
        // Invalid URL
      }
    }

    // Check body parameters
    if (requestData.body && requestData.body.includes('=')) {
      const params = new URLSearchParams(requestData.body);
      const paramNames = Array.from(params.keys());
      if (paramNames.length > 0) {
        return paramNames[0];
      }
    }

    return null;
  }

  /**
   * Extract parameter containing specific value
   */
  extractParameterContaining(requestData, value) {
    if (!requestData || !value) return null;

    // Check URL parameters
    if (requestData.url) {
      try {
        const url = new URL(requestData.url);
        for (const [key, paramValue] of url.searchParams) {
          if (paramValue.includes(value)) {
            return key;
          }
        }
      } catch (e) {
        // Invalid URL
      }
    }

    // Check body parameters
    if (requestData.body && requestData.body.includes('=')) {
      const params = new URLSearchParams(requestData.body);
      for (const [key, paramValue] of params) {
        if (paramValue.includes(value)) {
          return key;
        }
      }
    }

    return null;
  }

  /**
   * Generate vulnerability summary
   */
  async getVulnerabilitySummary() {
    const db = this.projectManager.getDatabase();
    if (!db) {
      throw new Error('No project loaded');
    }

    return new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          severity,
          status,
          COUNT(*) as count
        FROM vulnerabilities 
        GROUP BY severity, status
        ORDER BY 
          CASE severity WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 WHEN 'Low' THEN 4 ELSE 5 END,
          status
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const summary = {
            total: 0,
            by_severity: {},
            by_status: {},
            critical_open: 0,
            high_open: 0
          };

          for (const row of rows) {
            summary.total += row.count;
            
            if (!summary.by_severity[row.severity]) {
              summary.by_severity[row.severity] = 0;
            }
            summary.by_severity[row.severity] += row.count;
            
            if (!summary.by_status[row.status]) {
              summary.by_status[row.status] = 0;
            }
            summary.by_status[row.status] += row.count;

            // Count open critical/high issues
            if (row.status === 'New' || row.status === 'Confirmed') {
              if (row.severity === 'Critical') {
                summary.critical_open += row.count;
              } else if (row.severity === 'High') {
                summary.high_open += row.count;
              }
            }
          }

          resolve(summary);
        }
      });
    });
  }

  /**
   * Export vulnerabilities to JSON
   */
  async exportVulnerabilities(includeEvidence = true) {
    const vulnerabilities = await this.getVulnerabilities();
    const exportData = {
      exported_at: new Date().toISOString(),
      project: this.projectManager.getCurrentProject()?.name,
      total_vulnerabilities: vulnerabilities.length,
      vulnerabilities: []
    };

    for (const vuln of vulnerabilities) {
      const vulnData = { ...vuln };
      
      if (includeEvidence) {
        vulnData.http_evidence = await this.getHttpEvidence(vuln.id);
      }
      
      exportData.vulnerabilities.push(vulnData);
    }

    return exportData;
  }
}