/**
 * SQLMap Plugin for CortexAI
 * Provides interface for automated SQL injection detection and exploitation
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default {
  name: 'sqlmap',
  version: '1.0.0',
  description: 'Automated SQL injection detection and exploitation using SQLMap',
  author: 'CortexAI Team',
  
  async initialize() {
    // Verify sqlmap is installed
    try {
      await execAsync('which sqlmap || which sqlmap.py');
    } catch (error) {
      console.warn('⚠️  SQLMap not found. Install from: https://sqlmap.org/');
    }
  },
  
  tools: [
    {
      type: 'function',
      function: {
        name: 'sqlmap_scan',
        description: 'Test web applications for SQL injection vulnerabilities using SQLMap. Can detect and exploit various SQL injection types.',
        parameters: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Target URL to test (e.g., http://example.com/page.php?id=1)'
            },
            scan_level: {
              type: 'string',
              enum: ['basic', 'medium', 'aggressive'],
              description: 'Scan level - basic (level 1), medium (level 3), aggressive (level 5)'
            },
            data: {
              type: 'string',
              description: 'POST data to test (for POST requests)'
            },
            cookie: {
              type: 'string',
              description: 'HTTP Cookie header value'
            },
            technique: {
              type: 'string',
              enum: ['all', 'boolean', 'error', 'union', 'stacked', 'time'],
              description: 'SQL injection technique to use'
            },
            database: {
              type: 'string',
              description: 'Specific database to enumerate (after initial detection)'
            }
          },
          required: ['url', 'scan_level']
        }
      }
    }
  ],
  
  async handler(toolName, args) {
    try {
      switch (toolName) {
        case 'sqlmap_scan':
          return await this.handleSqlmapScan(args);
        default:
          return JSON.stringify({ success: false, error: `Unknown tool: ${toolName}` });
      }
    } catch (error) {
      return JSON.stringify({ success: false, error: error.message });
    }
  },
  
  async handleSqlmapScan(args) {
    const { url, scan_level, data, cookie, technique, database } = args;
    
    // Determine sqlmap command (try both locations)
    let sqlmapCmd = 'sqlmap';
    try {
      await execAsync('which sqlmap');
    } catch {
      try {
        await execAsync('which sqlmap.py');
        sqlmapCmd = 'sqlmap.py';
      } catch {
        return JSON.stringify({
          success: false,
          error: 'SQLMap not found. Please install it first.'
        });
      }
    }
    
    // Build sqlmap command
    let command = `${sqlmapCmd} -u "${url}" --batch`;
    
    // Set level and risk based on scan_level
    switch (scan_level) {
      case 'basic':
        command += ' --level=1 --risk=1';
        break;
      case 'medium':
        command += ' --level=3 --risk=2';
        break;
      case 'aggressive':
        command += ' --level=5 --risk=3';
        break;
    }
    
    // Add POST data if provided
    if (data) {
      command += ` --data="${data}"`;
    }
    
    // Add cookie if provided
    if (cookie) {
      command += ` --cookie="${cookie}"`;
    }
    
    // Add technique if specified
    if (technique && technique !== 'all') {
      const techniqueMap = {
        'boolean': 'B',
        'error': 'E',
        'union': 'U',
        'stacked': 'S',
        'time': 'T'
      };
      command += ` --technique=${techniqueMap[technique]}`;
    }
    
    // Add database enumeration if specified
    if (database) {
      command += ` -D ${database} --tables`;
    }
    
    // Add smart output
    command += ' --smart --flush-session';
    
    try {
      const startTime = Date.now();
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 20 * 1024 * 1024, // 20MB buffer
        timeout: 300000 // 5 minute timeout
      });
      const duration = Date.now() - startTime;
      
      return JSON.stringify({
        success: true,
        command: command.replace(/--cookie="[^"]*"/, '--cookie="[REDACTED]"'), // Hide sensitive cookie
        url: url,
        scan_level: scan_level,
        output: stdout,
        errors: stderr || null,
        duration_ms: duration,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      return JSON.stringify({
        success: false,
        command: command.replace(/--cookie="[^"]*"/, '--cookie="[REDACTED]"'),
        error: error.message,
        output: error.stdout || '',
        stderr: error.stderr || ''
      });
    }
  }
};
