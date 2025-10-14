# Plugin System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            agent.js                                 │
│                         (Main Agent)                                │
└────────────┬────────────────────────────────────────┬───────────────┘
             │                                        │
             │ uses                                   │ uses
             ▼                                        ▼
┌────────────────────────┐              ┌────────────────────────────┐
│    ToolRegistry        │              │     PluginLoader           │
│  (lib/ToolRegistry.js) │◄─────────────│  (lib/PluginLoader.js)     │
│                        │   passes     │                            │
│  - tools[]             │   registry   │  - pluginsDir              │
│  - handlers Map        │              │  - loadedPlugins[]         │
│                        │              │                            │
│  + register()          │              │  + loadPlugins()           │
│  + getTools()          │              │  + loadPlugin()            │
│  + getHandler()        │              │  + validateManifest()      │
│  + getStats()          │              │                            │
└────────────┬───────────┘              └────────────┬───────────────┘
             │                                       │
             │ contains                              │ loads
             │                                       │
             │                          ┌────────────▼────────────┐
             │                          │   plugins/ directory     │
             │                          │                          │
             │                          │  ┌──────────────────┐   │
             │                          │  │  plugin-name/    │   │
             │                          │  │                  │   │
             │                          │  │  plugin.json ◄───┼───┼─── Manifest
             │                          │  │  index.js    ◄───┼───┼─── Code
             │                          │  │                  │   │
             │                          │  └──────────────────┘   │
             │                          │                          │
             │                          │  ┌──────────────────┐   │
             │                          │  │ example-plugin/  │   │
             │                          │  │                  │   │
             │                          │  │  plugin.json     │   │
             │                          │  │  index.js        │   │
             │                          │  │                  │   │
             │                          │  └──────────────────┘   │
             │                          └──────────────────────────┘
             │                                       │
             │                                       │ exports init()
             │                                       ▼
             │                          ┌────────────────────────────┐
             │                          │   Plugin Module            │
             │                          │                            │
             │                          │   export async function    │
             │                          │   init(toolRegistry) {     │
             │                          │     toolRegistry.register( │
             │◄─────────────────────────┤       definition, handler  │
             │    registers tools       │     );                     │
             │                          │   }                        │
             │                          └────────────────────────────┘
             │
             │ provides to
             ▼
┌────────────────────────────────────────────────────────────────────┐
│                         OpenAI API                                 │
│                                                                    │
│   client.chat.completions.create({                                │
│     tools: toolRegistry.getTools(),  ◄── Dynamic tool list        │
│     ...                                                            │
│   })                                                               │
│                                                                    │
│   Returns: tool_calls [...] ────────────────┐                     │
└─────────────────────────────────────────────┼─────────────────────┘
                                               │
                                               │ AI decides to call
                                               ▼
                                ┌──────────────────────────────┐
                                │   callTool(name, args)       │
                                │                              │
                                │   handler = toolRegistry     │
                                │      .getHandler(name)       │
                                │                              │
                                │   result = await handler()   │
                                └──────────────────────────────┘


FLOW DIAGRAM:
═════════════

1. Startup:
   agent.js → creates ToolRegistry & PluginLoader
            → registerCoreTools()
            → pluginLoader.loadPlugins()

2. Plugin Loading:
   PluginLoader → scans plugins/ directory
                → validates plugin.json
                → imports plugin module
                → calls init(toolRegistry)
   
   Plugin      → toolRegistry.register(def, handler)

3. API Call:
   agent.js    → toolRegistry.getTools()
               → sends to OpenAI API
   
   OpenAI      → returns tool_calls

4. Tool Execution:
   agent.js    → callTool(name, args)
               → toolRegistry.getHandler(name)
               → handler(args)
               → return result


PLUGIN MANIFEST FORMAT:
═══════════════════════

plugin.json:
{
  "name": "string",           ← Required: Plugin identifier
  "version": "semver",        ← Required: Version number
  "author": "string",         ← Required: Author name
  "description": "string",    ← Required: Description
  "main": "index.js",         ← Optional: Entry point (default: index.js)
  "tools": ["tool1", ...]     ← Required: List of tool names
}


PLUGIN CODE STRUCTURE:
══════════════════════

index.js:
┌──────────────────────────────────────────────────┐
│ // Tool Definition (OpenAI format)               │
│ const toolDef = {                                │
│   type: "function",                              │
│   function: {                                    │
│     name: "tool_name",                           │
│     description: "...",                          │
│     parameters: { ... }                          │
│   }                                              │
│ };                                               │
│                                                  │
│ // Handler Implementation                        │
│ async function handler(args) {                   │
│   // Logic here                                  │
│   return JSON.stringify({ success: true, ... });│
│ }                                                │
│                                                  │
│ // Plugin Initialization (Required!)            │
│ export async function init(toolRegistry) {      │
│   toolRegistry.register(toolDef, handler);      │
│ }                                                │
└──────────────────────────────────────────────────┘


DATA FLOW:
══════════

User Input
    ↓
agent.js (AI Request)
    ↓
OpenAI API ← toolRegistry.getTools()
    ↓
AI Decision (which tools to call)
    ↓
callTool(name, args)
    ↓
toolRegistry.getHandler(name)
    ↓
handler(args) [Core or Plugin]
    ↓
Result (JSON string)
    ↓
Back to OpenAI
    ↓
AI Response
    ↓
User Output


REGISTRY STRUCTURE:
═══════════════════

ToolRegistry {
  tools: [
    { type: "function", function: { name: "execute_command", ... } },
    { type: "function", function: { name: "read_file", ... } },
    ...
    { type: "function", function: { name: "base64_encode", ... } },  ← Plugin
    { type: "function", function: { name: "hash_text", ... } },      ← Plugin
  ],
  
  handlers: Map {
    "execute_command" => async function executeCommand(args) {...},
    "read_file"       => async function readFile(args) {...},
    ...
    "base64_encode"   => async function base64EncodeHandler(args) {...},
    "hash_text"       => async function hashTextHandler(args) {...},
  }
}
```
