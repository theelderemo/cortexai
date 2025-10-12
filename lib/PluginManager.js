import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

/**
 * Plugin Manager for CortexAI
 * Handles plugin discovery, loading, validation, and registration
 */
export class PluginManager {
  constructor(pluginDirs = []) {
    this.pluginDirs = pluginDirs;
    this.plugins = new Map();
    this.tools = [];
    this.handlers = new Map();
  }

  /**
   * Initialize plugin manager and discover plugins
   */
  async initialize() {
    console.log('🔌 Initializing Plugin Manager...');
    
    for (const pluginDir of this.pluginDirs) {
      try {
        await this.discoverPlugins(pluginDir);
      } catch (error) {
        console.warn(`⚠️  Warning: Could not discover plugins in ${pluginDir}: ${error.message}`);
      }
    }
    
    console.log(`✅ Plugin Manager initialized with ${this.plugins.size} plugins`);
  }

  /**
   * Discover plugins in a directory
   */
  async discoverPlugins(pluginDir) {
    try {
      const stats = await fs.stat(pluginDir);
      if (!stats.isDirectory()) {
        return;
      }
    } catch (error) {
      // Directory doesn't exist
      return;
    }

    const entries = await fs.readdir(pluginDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.js')) {
        const pluginPath = path.join(pluginDir, entry.name);
        await this.loadPlugin(pluginPath);
      } else if (entry.isDirectory()) {
        // Check for index.js in subdirectory
        const indexPath = path.join(pluginDir, entry.name, 'index.js');
        try {
          await fs.access(indexPath);
          await this.loadPlugin(indexPath);
        } catch {
          // No index.js, skip
        }
      }
    }
  }

  /**
   * Load a plugin from a file path
   */
  async loadPlugin(pluginPath) {
    try {
      const pluginUrl = pathToFileURL(pluginPath).href;
      const pluginModule = await import(pluginUrl);
      
      // Validate plugin structure
      if (!pluginModule.default) {
        throw new Error('Plugin must export a default object');
      }
      
      const plugin = pluginModule.default;
      
      // Validate required fields
      if (!plugin.name) {
        throw new Error('Plugin must have a name');
      }
      
      if (!plugin.version) {
        throw new Error('Plugin must have a version');
      }
      
      // Check for duplicate
      if (this.plugins.has(plugin.name)) {
        console.warn(`⚠️  Plugin "${plugin.name}" is already loaded, skipping`);
        return;
      }
      
      // Initialize plugin if needed
      if (plugin.initialize && typeof plugin.initialize === 'function') {
        await plugin.initialize();
      }
      
      // Register plugin
      this.plugins.set(plugin.name, {
        ...plugin,
        path: pluginPath
      });
      
      // Register tools if provided
      if (plugin.tools && Array.isArray(plugin.tools)) {
        for (const tool of plugin.tools) {
          this.registerTool(tool, plugin.name);
        }
      }
      
      // Register handler if provided
      if (plugin.handler && typeof plugin.handler === 'function') {
        this.handlers.set(plugin.name, plugin.handler);
      }
      
      console.log(`✅ Loaded plugin: ${plugin.name} v${plugin.version}`);
      
    } catch (error) {
      console.error(`❌ Failed to load plugin from ${pluginPath}:`, error.message);
    }
  }

  /**
   * Register a tool from a plugin
   */
  registerTool(tool, pluginName) {
    // Validate tool structure
    if (!tool.type || tool.type !== 'function') {
      throw new Error(`Invalid tool type in plugin "${pluginName}"`);
    }
    
    if (!tool.function || !tool.function.name) {
      throw new Error(`Tool must have a function name in plugin "${pluginName}"`);
    }
    
    // Add metadata
    const enrichedTool = {
      ...tool,
      _plugin: pluginName
    };
    
    this.tools.push(enrichedTool);
  }

  /**
   * Get all registered tools
   */
  getTools() {
    return this.tools;
  }

  /**
   * Get a specific plugin by name
   */
  getPlugin(name) {
    return this.plugins.get(name);
  }

  /**
   * Get all plugins
   */
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  /**
   * Call a plugin handler
   */
  async callHandler(toolName, args) {
    // Find which plugin provides this tool
    const tool = this.tools.find(t => t.function.name === toolName);
    
    if (!tool || !tool._plugin) {
      return null;
    }
    
    const plugin = this.plugins.get(tool._plugin);
    
    if (!plugin || !plugin.handler) {
      throw new Error(`Plugin "${tool._plugin}" does not provide a handler`);
    }
    
    // Call the plugin's handler
    return await plugin.handler(toolName, args);
  }

  /**
   * Check if a tool is provided by a plugin
   */
  hasHandler(toolName) {
    const tool = this.tools.find(t => t.function.name === toolName);
    if (!tool || !tool._plugin) {
      return false;
    }
    
    const plugin = this.plugins.get(tool._plugin);
    return plugin && typeof plugin.handler === 'function';
  }

  /**
   * Reload a plugin
   */
  async reloadPlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin "${pluginName}" not found`);
    }
    
    // Remove old registration
    this.plugins.delete(pluginName);
    this.tools = this.tools.filter(t => t._plugin !== pluginName);
    this.handlers.delete(pluginName);
    
    // Reload
    await this.loadPlugin(plugin.path);
  }

  /**
   * Get plugin statistics
   */
  getStats() {
    return {
      totalPlugins: this.plugins.size,
      totalTools: this.tools.length,
      plugins: this.getAllPlugins().map(p => ({
        name: p.name,
        version: p.version,
        description: p.description,
        author: p.author,
        toolCount: this.tools.filter(t => t._plugin === p.name).length
      }))
    };
  }
}
