/**
 * PluginLoader - Dynamically loads plugins from the plugins directory
 * Each plugin must have a plugin.json manifest file
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PluginLoader {
  constructor(toolRegistry, pluginsDir = null) {
    this.toolRegistry = toolRegistry;
    this.pluginsDir = pluginsDir || path.join(__dirname, '../plugins');
    this.loadedPlugins = [];
  }

  /**
   * Scan plugins directory and load all valid plugins
   * @returns {Promise<Array>} Array of loaded plugin manifests
   */
  async loadPlugins() {
    console.log(`\n🔌 Scanning plugins directory: ${this.pluginsDir}`);

    try {
      // Check if plugins directory exists
      await fs.access(this.pluginsDir);
    } catch (error) {
      console.log('📁 Plugins directory not found, creating...');
      await fs.mkdir(this.pluginsDir, { recursive: true });
      return [];
    }

    try {
      const entries = await fs.readdir(this.pluginsDir, { withFileTypes: true });
      const pluginDirs = entries.filter(entry => entry.isDirectory());

      if (pluginDirs.length === 0) {
        console.log('ℹ️  No plugins found');
        return [];
      }

      console.log(`📦 Found ${pluginDirs.length} potential plugin(s)\n`);

      for (const pluginDir of pluginDirs) {
        try {
          await this.loadPlugin(pluginDir.name);
        } catch (error) {
          console.error(`❌ Failed to load plugin '${pluginDir.name}': ${error.message}`);
        }
      }

      console.log(`\n✅ Successfully loaded ${this.loadedPlugins.length} plugin(s)\n`);
      return this.loadedPlugins;

    } catch (error) {
      console.error(`❌ Error scanning plugins directory: ${error.message}`);
      return [];
    }
  }

  /**
   * Load a specific plugin by directory name
   * @param {string} pluginName - Directory name of the plugin
   * @returns {Promise<Object>} Plugin manifest
   */
  async loadPlugin(pluginName) {
    const pluginPath = path.join(this.pluginsDir, pluginName);
    const manifestPath = path.join(pluginPath, 'plugin.json');

    // Check if plugin.json exists
    try {
      await fs.access(manifestPath);
    } catch (error) {
      throw new Error(`Missing plugin.json manifest in '${pluginName}'`);
    }

    // Read and parse manifest
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    // Validate manifest
    this.validateManifest(manifest, pluginName);

    console.log(`📦 Loading plugin: ${manifest.name} v${manifest.version}`);
    console.log(`   Author: ${manifest.author}`);
    console.log(`   Description: ${manifest.description}`);

    // Load the plugin's main file
    const mainFile = manifest.main || 'index.js';
    const mainPath = path.join(pluginPath, mainFile);

    try {
      await fs.access(mainPath);
    } catch (error) {
      throw new Error(`Main file '${mainFile}' not found in plugin '${pluginName}'`);
    }

    // Import the plugin module
    const pluginModule = await import(`file://${mainPath}`);

    // Initialize the plugin
    if (typeof pluginModule.init === 'function') {
      await pluginModule.init(this.toolRegistry);
      console.log(`   ✅ Plugin initialized with ${manifest.tools.length} tool(s)`);
    } else {
      throw new Error(`Plugin '${pluginName}' does not export an init() function`);
    }

    // Store loaded plugin info
    this.loadedPlugins.push({
      name: manifest.name,
      version: manifest.version,
      author: manifest.author,
      description: manifest.description,
      tools: manifest.tools,
      path: pluginPath
    });

    return manifest;
  }

  /**
   * Validate plugin manifest structure
   * @param {Object} manifest - Plugin manifest object
   * @param {string} pluginName - Plugin directory name
   */
  validateManifest(manifest, pluginName) {
    const requiredFields = ['name', 'version', 'author', 'description', 'tools'];
    
    for (const field of requiredFields) {
      if (!manifest[field]) {
        throw new Error(`Plugin '${pluginName}' manifest missing required field: ${field}`);
      }
    }

    if (!Array.isArray(manifest.tools)) {
      throw new Error(`Plugin '${pluginName}' manifest 'tools' field must be an array`);
    }

    // Validate version format (semver-like)
    if (!/^\d+\.\d+\.\d+/.test(manifest.version)) {
      console.warn(`⚠️  Plugin '${pluginName}' version '${manifest.version}' is not semver format`);
    }

    // Validate tool names in manifest
    for (const toolName of manifest.tools) {
      if (typeof toolName !== 'string') {
        throw new Error(`Plugin '${pluginName}' manifest contains invalid tool name`);
      }
    }
  }

  /**
   * Get list of loaded plugins
   * @returns {Array} Array of loaded plugin info
   */
  getLoadedPlugins() {
    return this.loadedPlugins;
  }

  /**
   * Reload all plugins
   */
  async reloadPlugins() {
    console.log('\n🔄 Reloading plugins...');
    this.loadedPlugins = [];
    // Note: We don't clear the registry here as tools from core may exist
    // In a real implementation, you might want to track which tools came from which plugin
    await this.loadPlugins();
  }
}
