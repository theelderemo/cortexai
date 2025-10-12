# CortexAI Plugin System

The CortexAI Plugin System allows developers to extend the agent's capabilities by creating custom tool integrations without modifying the core codebase. This modular architecture enables the community to share security tool wrappers, custom scanners, and specialized functionality.

## 📁 Directory Structure

```
plugins/
├── README.md                 # This file
├── plugin-template.js        # Template for creating new plugins
├── core/                     # Core plugins (loaded by default)
├── custom/                   # Your custom plugins
└── examples/                 # Example plugins demonstrating capabilities
    ├── nmap-scanner.js       # Nmap network scanning wrapper
    ├── sqlmap.js            # SQLMap SQL injection testing wrapper
    └── gobuster.js          # Gobuster directory/DNS enumeration wrapper
```

## 🚀 Quick Start

### Using Existing Plugins

1. Ensure the plugin directory is configured in your `.env`:
   ```bash
   PLUGIN_DIRS=./plugins/core,./plugins/custom,./plugins/examples
   ENABLE_PLUGINS=true
   ```

2. Start CortexAI - plugins will be automatically discovered and loaded

3. Use plugin tools naturally in conversation:
   ```
   User: Scan example.com for open ports
   Assistant: I'll use nmap_scan to check for open ports...
   ```

### Creating a Custom Plugin

1. Copy the template:
   ```bash
   cp plugins/plugin-template.js plugins/custom/my-plugin.js
   ```

2. Edit your plugin following the structure:
   ```javascript
   export default {
     name: 'my-tool',
     version: '1.0.0',
     description: 'My custom security tool',
     
     tools: [
       {
         type: 'function',
         function: {
           name: 'my_scan',
           description: 'Performs my custom scan',
           parameters: { /* ... */ }
         }
       }
     ],
     
     async handler(toolName, args) {
       // Your implementation
     }
   };
   ```

3. Restart CortexAI - your plugin will be automatically loaded

## 📚 Plugin Structure

### Required Fields

- **name**: Unique identifier for your plugin (string)
- **version**: Semantic version (string)
- **tools**: Array of tool definitions following OpenAI function schema
- **handler**: Async function that executes tool calls

### Optional Fields

- **description**: What the plugin does (string)
- **author**: Plugin author (string)
- **homepage**: Plugin repository or documentation URL (string)
- **initialize**: Async setup function called on load
- **cleanup**: Async teardown function called on unload

### Tool Definition Schema

Tools follow the OpenAI function calling format:

```javascript
{
  type: 'function',
  function: {
    name: 'tool_name',           // Unique tool identifier
    description: 'What it does',  // AI uses this to decide when to call
    parameters: {
      type: 'object',
      properties: {
        param1: {
          type: 'string',
          description: 'Parameter description'
        }
      },
      required: ['param1']
    }
  }
}
```

### Handler Function

The handler receives tool calls and returns JSON strings:

```javascript
async handler(toolName, args) {
  try {
    switch (toolName) {
      case 'my_tool':
        const result = await doSomething(args);
        return JSON.stringify({
          success: true,
          data: result
        });
        
      default:
        return JSON.stringify({
          success: false,
          error: 'Unknown tool'
        });
    }
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message
    });
  }
}
```

## 🔧 Example Plugins

### Nmap Scanner

Provides structured network scanning:

```javascript
// Example usage
{
  "tool": "nmap_scan",
  "args": {
    "target": "192.168.1.1",
    "scan_type": "service",
    "ports": "1-1000"
  }
}
```

Scan types:
- `quick`: Fast scan of common ports
- `full`: Complete port scan (1-65535)
- `stealth`: Stealthy SYN scan
- `service`: Service version detection
- `os`: Operating system detection
- `vuln`: Vulnerability scanning
- `custom`: Use custom nmap arguments

### SQLMap

Automated SQL injection testing:

```javascript
// Example usage
{
  "tool": "sqlmap_scan",
  "args": {
    "url": "http://example.com/page?id=1",
    "scan_level": "medium",
    "cookie": "session=abc123"
  }
}
```

Scan levels:
- `basic`: Quick scan (level 1, risk 1)
- `medium`: Standard scan (level 3, risk 2)
- `aggressive`: Thorough scan (level 5, risk 3)

### Gobuster

Directory and DNS enumeration:

```javascript
// Directory brute-forcing
{
  "tool": "gobuster_dir",
  "args": {
    "url": "https://example.com",
    "wordlist": "/usr/share/wordlists/dirb/common.txt",
    "extensions": "php,html,txt"
  }
}

// DNS subdomain enumeration
{
  "tool": "gobuster_dns",
  "args": {
    "domain": "example.com",
    "wordlist": "/usr/share/wordlists/subdomains.txt"
  }
}
```

## 🎯 Best Practices

### Security

- **Validate inputs**: Always sanitize and validate user inputs
- **Escape commands**: Use proper escaping for shell commands
- **Limit permissions**: Run with minimal required privileges
- **Handle secrets**: Never log sensitive data (passwords, tokens, etc.)
- **Timeout operations**: Set reasonable timeouts for long-running operations

### Error Handling

```javascript
async handler(toolName, args) {
  try {
    // Validate inputs
    if (!args.required_param) {
      return JSON.stringify({
        success: false,
        error: 'Missing required parameter: required_param'
      });
    }
    
    // Perform operation
    const result = await performOperation(args);
    
    return JSON.stringify({
      success: true,
      data: result
    });
    
  } catch (error) {
    // Log error (but not sensitive data)
    console.error(`Plugin error in ${toolName}:`, error.message);
    
    return JSON.stringify({
      success: false,
      error: error.message
    });
  }
}
```

### Performance

- Use `maxBuffer` for large outputs
- Set appropriate timeouts
- Consider async operations for I/O
- Clean up resources in cleanup function

### Documentation

- Write clear tool descriptions (AI uses these)
- Document all parameters thoroughly
- Include usage examples
- Specify prerequisites (dependencies, tools)

## 🔄 Plugin Lifecycle

1. **Discovery**: PluginManager scans plugin directories
2. **Loading**: Plugin module is imported
3. **Validation**: Plugin structure is validated
4. **Initialization**: `initialize()` is called (if present)
5. **Registration**: Tools are registered with the agent
6. **Ready**: Tools are available for AI to call
7. **Execution**: Handler is called when tool is invoked
8. **Cleanup**: `cleanup()` is called on shutdown (if present)

## 🛠️ Development Tips

### Testing Your Plugin

```javascript
// Add this to your plugin for local testing
if (import.meta.url === `file://${process.argv[1]}`) {
  const plugin = /* your default export */;
  
  // Test initialization
  await plugin.initialize();
  
  // Test handler
  const result = await plugin.handler('tool_name', {
    param: 'value'
  });
  
  console.log(JSON.parse(result));
}
```

Run: `node plugins/custom/my-plugin.js`

### Debugging

Enable verbose logging in your plugin:

```javascript
const DEBUG = process.env.PLUGIN_DEBUG === 'true';

if (DEBUG) {
  console.log('Debug info:', data);
}
```

### Tool Naming Conventions

- Use lowercase with underscores: `my_tool_name`
- Be descriptive: `nmap_scan` not `scan`
- Prefix with tool name for clarity: `burp_active_scan`

### Return Format

Always return JSON strings with:
- `success` (boolean): Whether operation succeeded
- `error` (string): Error message if failed
- `data` or relevant fields: Your operation results

```javascript
// Success
{
  "success": true,
  "data": { /* results */ }
}

// Failure
{
  "success": false,
  "error": "Error description"
}
```

## 📦 Publishing Plugins

To share your plugin with the community:

1. Create a GitHub repository
2. Include:
   - Plugin file(s)
   - README with usage instructions
   - LICENSE file
   - Example usage
3. Tag releases with semantic versions
4. Submit to CortexAI plugins list (coming soon)

## 🤝 Contributing

We welcome plugin contributions! See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

For plugin-specific considerations:
- Test thoroughly with various inputs
- Include error handling for edge cases
- Document prerequisites and dependencies
- Follow the security best practices above
- Provide usage examples

## 📄 License

Plugins should be compatible with the main CortexAI license. See [LICENSE](../LICENSE) for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/theelderemo/cortexai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/theelderemo/cortexai/discussions)
- **Documentation**: [Main Documentation](../documentation/README.md)

## 📝 Example: Complete Plugin

Here's a minimal but complete plugin:

```javascript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default {
  name: 'whois-lookup',
  version: '1.0.0',
  description: 'Domain WHOIS information lookup',
  author: 'Your Name',
  
  async initialize() {
    try {
      await execAsync('which whois');
    } catch {
      console.warn('⚠️  whois command not found');
    }
  },
  
  tools: [{
    type: 'function',
    function: {
      name: 'whois_lookup',
      description: 'Look up domain registration information',
      parameters: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            description: 'Domain name to lookup'
          }
        },
        required: ['domain']
      }
    }
  }],
  
  async handler(toolName, args) {
    try {
      const { stdout } = await execAsync(`whois ${args.domain}`);
      return JSON.stringify({
        success: true,
        domain: args.domain,
        whois_data: stdout
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: error.message
      });
    }
  }
};
```

Save as `plugins/custom/whois-lookup.js` and restart CortexAI!

---

**Happy Plugin Development! 🎉**
