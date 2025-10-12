# Plugin System Implementation

## Overview

CortexAI now features a dynamic plugin system that allows extending the agent's capabilities without modifying the core codebase. The system consists of three main components:

1. **ToolRegistry** - Manages tool definitions and handlers
2. **PluginLoader** - Scans and loads plugins from the plugins directory
3. **Plugin Manifest (plugin.json)** - Standard format for plugin metadata

## Architecture

### ToolRegistry Class (`lib/ToolRegistry.js`)

The ToolRegistry decouples tool registration from the core agent, providing:

- **Dynamic Registration**: Plugins can register tools at runtime
- **Handler Management**: Maps tool names to their implementation functions
- **Tool Lookup**: Provides tools to the OpenAI API and retrieves handlers for execution
- **Statistics**: Track registered tools and categories

Key Methods:
- `register(toolDefinition, handler)` - Register a single tool
- `registerMultiple(toolDefinitions)` - Register multiple tools at once
- `getTools()` - Get all tool definitions for OpenAI API
- `getHandler(toolName)` - Get handler function for a tool
- `hasHandler(toolName)` - Check if tool exists
- `unregister(toolName)` - Remove a tool
- `getStats()` - Get registry statistics

### PluginLoader Class (`lib/PluginLoader.js`)

The PluginLoader handles plugin discovery and initialization:

- **Directory Scanning**: Automatically finds plugin directories
- **Manifest Validation**: Ensures plugins have valid plugin.json files
- **Dynamic Loading**: Imports and initializes plugin modules
- **Error Handling**: Gracefully handles plugin loading failures

Key Methods:
- `loadPlugins()` - Scan and load all plugins
- `loadPlugin(pluginName)` - Load a specific plugin
- `validateManifest(manifest, pluginName)` - Validate plugin.json structure
- `getLoadedPlugins()` - Get list of loaded plugins
- `reloadPlugins()` - Reload all plugins

### Plugin Manifest Format

Every plugin must include a `plugin.json` file:

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "author": "Author Name",
  "description": "Plugin description",
  "main": "index.js",
  "tools": [
    "tool_name_1",
    "tool_name_2"
  ]
}
```

Required Fields:
- **name**: Unique plugin identifier
- **version**: Semver version (e.g., "1.0.0")
- **author**: Plugin author
- **description**: Brief description
- **tools**: Array of tool names provided

Optional Fields:
- **main**: Entry point file (defaults to "index.js")

## Changes to agent.js

### Imports Added
```javascript
import { ToolRegistry } from "./lib/ToolRegistry.js";
import { PluginLoader } from "./lib/PluginLoader.js";
```

### Initialization
```javascript
// Create instances
const toolRegistry = new ToolRegistry();
const pluginLoader = new PluginLoader(toolRegistry);

// At startup
registerCoreTools();           // Register built-in tools
await pluginLoader.loadPlugins(); // Load plugin tools
```

### Tool Registration
Replaced static `tools` array with dynamic registration:

**Before:**
```javascript
const tools = [
  { type: "function", function: { name: "execute_command", ... } },
  // ... more tools
];
```

**After:**
```javascript
const coreToolDefinitions = [
  { type: "function", function: { name: "execute_command", ... } },
  // ... more tools
];

function registerCoreTools() {
  for (const toolDef of coreToolDefinitions) {
    const handler = coreToolHandlers[toolDef.function.name];
    toolRegistry.register(toolDef, handler);
  }
}
```

### Tool Execution
Simplified `callTool()` function to use registry:

**Before:**
```javascript
switch (toolName) {
  case "execute_command":
    result = await executeCommand(args.command, args.working_directory);
    break;
  // ... 20+ more cases
}
```

**After:**
```javascript
const handler = toolRegistry.getHandler(toolName);
if (handler) {
  result = await handler(args);
}
```

### API Integration
Updated OpenAI API call to use dynamic tools:

```javascript
const response = await client.chat.completions.create({
  model: modelName,
  messages: currentMessages,
  tools: toolRegistry.getTools(), // Dynamic tools from registry
  tool_choice: "auto",
  max_tokens: 16384,
  temperature: 0.7,
});
```

## Example Plugin

An example plugin is included at `plugins/example-plugin/`:

### plugin.json
```json
{
  "name": "example-plugin",
  "version": "1.0.0",
  "author": "CortexAI Team",
  "description": "Example plugin with encoding/hashing tools",
  "main": "index.js",
  "tools": ["base64_encode", "base64_decode", "hash_text"]
}
```

### index.js Structure
```javascript
// Tool definition (OpenAI format)
const toolDefinition = {
  type: "function",
  function: {
    name: "tool_name",
    description: "What it does",
    parameters: { /* ... */ }
  }
};

// Tool handler (async function)
async function toolHandler(args) {
  try {
    // Implementation
    return JSON.stringify({ success: true, data: result });
  } catch (error) {
    return JSON.stringify({ success: false, error: error.message });
  }
}

// Plugin initialization (required export)
export async function init(toolRegistry) {
  toolRegistry.register(toolDefinition, toolHandler);
}
```

## Benefits

1. **Extensibility**: Add new tools without modifying core code
2. **Modularity**: Tools organized in self-contained plugins
3. **Maintainability**: Cleaner separation of concerns
4. **Flexibility**: Enable/disable plugins by removing directories
5. **Development**: Easier for contributors to add features
6. **Testing**: Plugins can be tested independently

## Startup Sequence

1. Load environment variables
2. Initialize ToolRegistry and PluginLoader
3. Register core tools (23 built-in tools)
4. Scan plugins directory
5. Load and validate each plugin
6. Import plugin modules
7. Call plugin `init()` functions
8. Display tool count
9. Start interactive mode

## Plugin Development

See `plugins/README.md` for comprehensive plugin development guide including:
- Plugin structure requirements
- Tool definition format
- Handler implementation patterns
- Best practices
- Testing procedures
- Troubleshooting tips

## Future Enhancements

Possible future improvements:
- Plugin dependencies and ordering
- Plugin lifecycle hooks (load, unload, reload)
- Plugin configuration files
- Plugin permissions/sandboxing
- Plugin marketplace/repository
- Hot-reloading during development
- Per-plugin logging
- Plugin API versioning
