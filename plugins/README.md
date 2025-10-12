# Plugin System

## Overview

The CortexAI plugin system allows you to extend the agent's capabilities by adding custom tools. Plugins are dynamically loaded at startup from the `plugins/` directory.

## Plugin Structure

Each plugin must be in its own directory under `plugins/` with the following structure:

```
plugins/
  └── my-plugin/
      ├── plugin.json      (required - plugin manifest)
      ├── index.js         (required - main plugin file)
      └── ... other files
```

## Plugin Manifest (plugin.json)

Every plugin **must** include a `plugin.json` file with the following structure:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "Brief description of what your plugin does",
  "main": "index.js",
  "tools": [
    "tool_name_1",
    "tool_name_2"
  ]
}
```

### Manifest Fields

- **name** (required): Unique identifier for your plugin
- **version** (required): Semver version number (e.g., "1.0.0")
- **author** (required): Plugin author name or organization
- **description** (required): Brief description of plugin functionality
- **main** (optional): Entry point file, defaults to "index.js"
- **tools** (required): Array of tool names this plugin provides

## Plugin Implementation (index.js)

Your plugin's main file must export an `init()` function that receives the `toolRegistry`:

```javascript
/**
 * Initialize the plugin
 * @param {ToolRegistry} toolRegistry - The tool registry to register tools with
 */
export async function init(toolRegistry) {
  // Register your tools here
  toolRegistry.register(myToolDefinition, myToolHandler);
}
```

### Tool Definition Format

Tools use the OpenAI function calling format:

```javascript
const myToolDefinition = {
  type: "function",
  function: {
    name: "my_tool",
    description: "What this tool does",
    parameters: {
      type: "object",
      properties: {
        param1: {
          type: "string",
          description: "Description of parameter"
        },
        param2: {
          type: "number",
          description: "Another parameter"
        }
      },
      required: ["param1"]
    }
  }
};
```

### Tool Handler Function

The handler is an async function that implements the tool's logic:

```javascript
async function myToolHandler(args) {
  // args contains the parameters passed by the AI
  const { param1, param2 } = args;
  
  try {
    // Your tool logic here
    const result = await doSomething(param1, param2);
    
    // Return JSON string with results
    return JSON.stringify({
      success: true,
      data: result
    });
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message
    });
  }
}
```

## Complete Plugin Example

### plugin.json
```json
{
  "name": "example-plugin",
  "version": "1.0.0",
  "author": "CortexAI Team",
  "description": "Example plugin demonstrating the plugin system",
  "main": "index.js",
  "tools": [
    "greet_user",
    "calculate_fibonacci"
  ]
}
```

### index.js
```javascript
// Tool 1: Greet User
const greetUserDefinition = {
  type: "function",
  function: {
    name: "greet_user",
    description: "Greets a user with a personalized message",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the user to greet"
        },
        language: {
          type: "string",
          enum: ["en", "es", "fr"],
          description: "Language for greeting (default: en)"
        }
      },
      required: ["name"]
    }
  }
};

async function greetUserHandler(args) {
  const { name, language = "en" } = args;
  
  const greetings = {
    en: `Hello, ${name}!`,
    es: `¡Hola, ${name}!`,
    fr: `Bonjour, ${name}!`
  };
  
  return JSON.stringify({
    success: true,
    greeting: greetings[language] || greetings.en
  });
}

// Tool 2: Calculate Fibonacci
const fibonacciDefinition = {
  type: "function",
  function: {
    name: "calculate_fibonacci",
    description: "Calculate the nth Fibonacci number",
    parameters: {
      type: "object",
      properties: {
        n: {
          type: "number",
          description: "Position in Fibonacci sequence (0-based)"
        }
      },
      required: ["n"]
    }
  }
};

async function fibonacciHandler(args) {
  const { n } = args;
  
  if (n < 0 || n > 100) {
    return JSON.stringify({
      success: false,
      error: "n must be between 0 and 100"
    });
  }
  
  function fib(num) {
    if (num <= 1) return num;
    return fib(num - 1) + fib(num - 2);
  }
  
  const result = fib(Math.floor(n));
  
  return JSON.stringify({
    success: true,
    n: n,
    result: result
  });
}

// Plugin initialization
export async function init(toolRegistry) {
  toolRegistry.register(greetUserDefinition, greetUserHandler);
  toolRegistry.register(fibonacciDefinition, fibonacciHandler);
  
  console.log("   🎉 Example plugin tools registered");
}
```

## Best Practices

1. **Always return JSON strings** from your tool handlers
2. **Include success/error status** in your responses
3. **Validate input parameters** before processing
4. **Handle errors gracefully** and return meaningful error messages
5. **Keep tool names descriptive** and use snake_case
6. **Document your parameters** with clear descriptions
7. **Use async/await** for asynchronous operations
8. **Follow semver** for version numbers

## Testing Your Plugin

1. Place your plugin directory in `plugins/`
2. Restart the agent - it will automatically load your plugin
3. Check the console output for successful loading
4. Test your tools by asking the AI to use them

## Troubleshooting

- **Plugin not loading**: Check console for error messages
- **Missing plugin.json**: Ensure manifest file exists in plugin root
- **Tool not found**: Verify tool names in manifest match registration
- **Invalid manifest**: Validate JSON syntax and required fields
- **Handler errors**: Check that handler function is async and returns JSON string
