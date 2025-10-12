/**
 * ToolRegistry - Manages tool definitions and handlers for the AI agent
 * This class decouples tool registration from the core agent, allowing
 * plugins to dynamically register their tools.
 */

export class ToolRegistry {
  constructor() {
    this.tools = [];
    this.handlers = new Map();
  }

  /**
   * Register a new tool with the registry
   * @param {Object} toolDefinition - OpenAI function calling format tool definition
   * @param {Function} handler - Async function that implements the tool logic
   */
  register(toolDefinition, handler) {
    if (!toolDefinition || !toolDefinition.function || !toolDefinition.function.name) {
      throw new Error('Invalid tool definition: must include function.name');
    }

    if (typeof handler !== 'function') {
      throw new Error('Invalid handler: must be a function');
    }

    const toolName = toolDefinition.function.name;

    // Check for duplicate registrations
    const existingIndex = this.tools.findIndex(
      t => t.function.name === toolName
    );

    if (existingIndex !== -1) {
      console.warn(`⚠️  Tool '${toolName}' is already registered. Replacing...`);
      this.tools[existingIndex] = toolDefinition;
    } else {
      this.tools.push(toolDefinition);
    }

    // Store the handler
    this.handlers.set(toolName, handler);

    console.log(`✅ Registered tool: ${toolName}`);
  }

  /**
   * Register multiple tools at once
   * @param {Array} toolDefinitions - Array of {definition, handler} objects
   */
  registerMultiple(toolDefinitions) {
    for (const { definition, handler } of toolDefinitions) {
      this.register(definition, handler);
    }
  }

  /**
   * Get all registered tool definitions (for OpenAI API)
   * @returns {Array} Array of tool definitions
   */
  getTools() {
    return this.tools;
  }

  /**
   * Get a specific tool's handler
   * @param {string} toolName - Name of the tool
   * @returns {Function|null} Handler function or null if not found
   */
  getHandler(toolName) {
    return this.handlers.get(toolName) || null;
  }

  /**
   * Check if a tool is registered
   * @param {string} toolName - Name of the tool
   * @returns {boolean} True if tool exists
   */
  hasHandler(toolName) {
    return this.handlers.has(toolName);
  }

  /**
   * Unregister a tool
   * @param {string} toolName - Name of the tool to remove
   */
  unregister(toolName) {
    const index = this.tools.findIndex(t => t.function.name === toolName);
    if (index !== -1) {
      this.tools.splice(index, 1);
    }
    this.handlers.delete(toolName);
    console.log(`🗑️  Unregistered tool: ${toolName}`);
  }

  /**
   * Clear all registered tools
   */
  clear() {
    this.tools = [];
    this.handlers.clear();
    console.log('🧹 Cleared all registered tools');
  }

  /**
   * Get statistics about registered tools
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      totalTools: this.tools.length,
      toolNames: this.tools.map(t => t.function.name),
      categories: this.tools.reduce((acc, tool) => {
        const category = tool.function.category || 'uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {})
    };
  }
}
