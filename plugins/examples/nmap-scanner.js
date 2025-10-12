/**
 * Nmap Scanner Plugin for CortexAI
 * Provides structured interface for Nmap network scanning
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default {
  name: 'nmap-scanner',
  version: '1.0.0',
  description: 'Network scanning and reconnaissance using Nmap',
  author: 'CortexAI Team',
  
  async initialize() {
    // Verify nmap is installed
    try {
      await execAsync('which nmap');
    } catch (error) {
      console.warn('⚠️  Nmap not found in PATH. Install with: sudo apt-get install nmap');
    }
  },
  
  tools: [
    {
      type: 'function',
      function: {
        name: 'nmap_scan',
        description: 'Perform network scanning with Nmap. Supports various scan types including port scanning, service detection, and OS fingerprinting.',
        parameters: {
          type: 'object',
          properties: {
            target: {
              type: 'string',
              description: 'Target IP address, hostname, or CIDR range (e.g., 192.168.1.1, example.com, 10.0.0.0/24)'
            },
            scan_type: {
              type: 'string',
              enum: ['quick', 'full', 'stealth', 'service', 'os', 'vuln', 'custom'],
              description: 'Type of scan to perform'
            },
            ports: {
              type: 'string',
              description: 'Port specification (e.g., "80,443", "1-1000", "top-100"). Leave empty for scan type defaults.'
            },
            arguments: {
              type: 'string',
              description: 'Custom nmap arguments for advanced usage (only used with scan_type="custom")'
            }
          },
          required: ['target', 'scan_type']
        }
      }
    }
  ],
  
  async handler(toolName, args) {
    try {
      switch (toolName) {
        case 'nmap_scan':
          return await this.handleNmapScan(args);
        default:
          return JSON.stringify({ success: false, error: `Unknown tool: ${toolName}` });
      }
    } catch (error) {
      return JSON.stringify({ success: false, error: error.message });
    }
  },
  
  async handleNmapScan(args) {
    const { target, scan_type, ports, arguments: customArgs } = args;
    
    // Build nmap command based on scan type
    let nmapCommand = 'nmap';
    
    switch (scan_type) {
      case 'quick':
        nmapCommand += ' -T4 -F';
        break;
      case 'full':
        nmapCommand += ' -p- -T4';
        break;
      case 'stealth':
        nmapCommand += ' -sS -T2';
        break;
      case 'service':
        nmapCommand += ' -sV -sC';
        break;
      case 'os':
        nmapCommand += ' -O --osscan-guess';
        break;
      case 'vuln':
        nmapCommand += ' -sV --script vuln';
        break;
      case 'custom':
        if (!customArgs) {
          return JSON.stringify({
            success: false,
            error: 'Custom scan type requires "arguments" parameter'
          });
        }
        nmapCommand += ` ${customArgs}`;
        break;
    }
    
    // Add port specification if provided
    if (ports && scan_type !== 'custom') {
      nmapCommand += ` -p ${ports}`;
    }
    
    // Add target
    nmapCommand += ` ${target}`;
    
    try {
      const startTime = Date.now();
      const { stdout, stderr } = await execAsync(nmapCommand, {
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large scans
      });
      const duration = Date.now() - startTime;
      
      return JSON.stringify({
        success: true,
        command: nmapCommand,
        target: target,
        scan_type: scan_type,
        output: stdout,
        errors: stderr || null,
        duration_ms: duration,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      return JSON.stringify({
        success: false,
        command: nmapCommand,
        error: error.message,
        output: error.stdout || '',
        stderr: error.stderr || ''
      });
    }
  }
};
