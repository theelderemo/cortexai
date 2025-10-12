/**
 * CortexAI Plugin Template
 * 
 * This is a template for creating custom plugins for CortexAI.
 * Copy this file to create your own plugin.
 * 
 * A plugin consists of:
 * - Metadata (name, version, description, author)
 * - Tools (function definitions that will be registered with the AI)
 * - Handler (function that executes when a tool is called)
 * - Optional: initialize function for setup
 * - Optional: cleanup function for teardown
 */

export default {
  // ============ METADATA ============
  // Required: Unique name for your plugin
  name: 'example-plugin',
  
  // Required: Semantic version
  version: '1.0.0',
  
  // Optional: Description of what the plugin does
  description: 'An example plugin template for CortexAI',
  
  // Optional: Author information
  author: 'Your Name',
  
  // Optional: Plugin homepage or repository
  homepage: 'https://github.com/yourusername/cortexai-plugin',

  // ============ INITIALIZATION ============
  /**
   * Optional: Initialize function called when plugin is loaded
   * Use this to set up resources, validate dependencies, etc.
   */
  async initialize() {
    console.log('Initializing example plugin...');
    // Add initialization logic here
  },

  // ============ TOOLS ============
  /**
   * Required: Array of tool definitions
   * Each tool follows the OpenAI function calling schema
   */
  tools: [
    {
      type: 'function',
      function: {
        name: 'example_tool',
        description: 'An example tool that demonstrates the plugin interface',
        parameters: {
          type: 'object',
          properties: {
            input: {
              type: 'string',
              description: 'Example input parameter'
            },
            option: {
              type: 'string',
              enum: ['option1', 'option2', 'option3'],
              description: 'An optional parameter with predefined values'
            }
          },
          required: ['input']
        }
      }
    }
  ],

  // ============ HANDLER ============
  /**
   * Required: Handler function that executes tool calls
   * @param {string} toolName - Name of the tool being called
   * @param {object} args - Arguments passed to the tool
   * @returns {Promise<string>} JSON string with result
   */
  async handler(toolName, args) {
    try {
      switch (toolName) {
        case 'example_tool':
          return await this.handleExampleTool(args);
        
        default:
          return JSON.stringify({
            success: false,
            error: `Unknown tool: ${toolName}`
          });
      }
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: error.message
      });
    }
  },

  // ============ TOOL IMPLEMENTATIONS ============
  /**
   * Implementation of example_tool
   */
  async handleExampleTool(args) {
    const { input, option } = args;
    
    // Your tool implementation here
    const result = {
      success: true,
      message: `Processed input: ${input}`,
      option: option || 'default',
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(result);
  },

  // ============ CLEANUP ============
  /**
   * Optional: Cleanup function called when plugin is unloaded
   */
  async cleanup() {
    console.log('Cleaning up example plugin...');
    // Add cleanup logic here
  }
};
