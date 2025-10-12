/**
 * Gobuster Plugin for CortexAI
 * Provides interface for directory/file brute-forcing and DNS subdomain enumeration
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default {
  name: 'gobuster',
  version: '1.0.0',
  description: 'Directory/file brute-forcing and DNS enumeration using Gobuster',
  author: 'CortexAI Team',
  
  async initialize() {
    // Verify gobuster is installed
    try {
      await execAsync('which gobuster');
    } catch (error) {
      console.warn('⚠️  Gobuster not found. Install from: https://github.com/OJ/gobuster');
    }
  },
  
  tools: [
    {
      type: 'function',
      function: {
        name: 'gobuster_dir',
        description: 'Brute-force directories and files on web servers using Gobuster. Useful for discovering hidden resources.',
        parameters: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Target URL (e.g., https://example.com)'
            },
            wordlist: {
              type: 'string',
              description: 'Path to wordlist file (e.g., /usr/share/wordlists/dirb/common.txt)'
            },
            extensions: {
              type: 'string',
              description: 'File extensions to search for (e.g., "php,html,txt")'
            },
            threads: {
              type: 'number',
              description: 'Number of concurrent threads (default: 10)'
            },
            status_codes: {
              type: 'string',
              description: 'Status codes to match (e.g., "200,204,301,302,307,401,403")'
            }
          },
          required: ['url', 'wordlist']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'gobuster_dns',
        description: 'Enumerate DNS subdomains using Gobuster. Useful for discovering subdomains.',
        parameters: {
          type: 'object',
          properties: {
            domain: {
              type: 'string',
              description: 'Target domain (e.g., example.com)'
            },
            wordlist: {
              type: 'string',
              description: 'Path to subdomain wordlist file'
            },
            threads: {
              type: 'number',
              description: 'Number of concurrent threads (default: 10)'
            }
          },
          required: ['domain', 'wordlist']
        }
      }
    }
  ],
  
  async handler(toolName, args) {
    try {
      switch (toolName) {
        case 'gobuster_dir':
          return await this.handleGobusterDir(args);
        case 'gobuster_dns':
          return await this.handleGobusterDns(args);
        default:
          return JSON.stringify({ success: false, error: `Unknown tool: ${toolName}` });
      }
    } catch (error) {
      return JSON.stringify({ success: false, error: error.message });
    }
  },
  
  async handleGobusterDir(args) {
    const { url, wordlist, extensions, threads, status_codes } = args;
    
    // Check if gobuster is available
    try {
      await execAsync('which gobuster');
    } catch {
      return JSON.stringify({
        success: false,
        error: 'Gobuster not found. Please install it first.'
      });
    }
    
    // Build command
    let command = `gobuster dir -u "${url}" -w "${wordlist}"`;
    
    if (extensions) {
      command += ` -x ${extensions}`;
    }
    
    if (threads) {
      command += ` -t ${threads}`;
    }
    
    if (status_codes) {
      command += ` -s ${status_codes}`;
    } else {
      command += ' -s "200,204,301,302,307,401,403"';
    }
    
    command += ' --no-error -q'; // Quiet mode, no errors
    
    try {
      const startTime = Date.now();
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        timeout: 600000 // 10 minute timeout
      });
      const duration = Date.now() - startTime;
      
      // Parse results
      const results = [];
      const lines = stdout.split('\n');
      for (const line of lines) {
        if (line.trim() && !line.startsWith('=')) {
          results.push(line.trim());
        }
      }
      
      return JSON.stringify({
        success: true,
        command: command,
        url: url,
        wordlist: wordlist,
        results: results,
        result_count: results.length,
        output: stdout,
        errors: stderr || null,
        duration_ms: duration,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      return JSON.stringify({
        success: false,
        command: command,
        error: error.message,
        output: error.stdout || '',
        stderr: error.stderr || ''
      });
    }
  },
  
  async handleGobusterDns(args) {
    const { domain, wordlist, threads } = args;
    
    // Check if gobuster is available
    try {
      await execAsync('which gobuster');
    } catch {
      return JSON.stringify({
        success: false,
        error: 'Gobuster not found. Please install it first.'
      });
    }
    
    // Build command
    let command = `gobuster dns -d "${domain}" -w "${wordlist}"`;
    
    if (threads) {
      command += ` -t ${threads}`;
    }
    
    command += ' --no-error -q'; // Quiet mode, no errors
    
    try {
      const startTime = Date.now();
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        timeout: 600000 // 10 minute timeout
      });
      const duration = Date.now() - startTime;
      
      // Parse results
      const subdomains = [];
      const lines = stdout.split('\n');
      for (const line of lines) {
        if (line.includes('Found:')) {
          const match = line.match(/Found: (.+)/);
          if (match) {
            subdomains.push(match[1].trim());
          }
        }
      }
      
      return JSON.stringify({
        success: true,
        command: command,
        domain: domain,
        wordlist: wordlist,
        subdomains: subdomains,
        subdomain_count: subdomains.length,
        output: stdout,
        errors: stderr || null,
        duration_ms: duration,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      return JSON.stringify({
        success: false,
        command: command,
        error: error.message,
        output: error.stdout || '',
        stderr: error.stderr || ''
      });
    }
  }
};
