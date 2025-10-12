/**
 * This file is part of CortexAI.
 *
 * Copyright (c) 2025 Christopher Dickinson
 *
 * CortexAI is licensed under the MIT License.
 * See the LICENSE file in the project root for full license information.
 */

/**
 * Example Plugin for CortexAI
 * Demonstrates how to create a plugin with multiple tools
 * This plugin provides encoding/hashing utilities
 */

import crypto from 'crypto';

// ============ Tool 1: Base64 Encode ============
const base64EncodeDefinition = {
  type: "function",
  function: {
    name: "base64_encode",
    description: "Encode text to Base64 format",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text to encode in Base64"
        }
      },
      required: ["text"]
    }
  }
};

async function base64EncodeHandler(args) {
  try {
    const { text } = args;
    const encoded = Buffer.from(text, 'utf-8').toString('base64');
    
    return JSON.stringify({
      success: true,
      original: text,
      encoded: encoded,
      length: encoded.length
    });
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message
    });
  }
}

// ============ Tool 2: Base64 Decode ============
const base64DecodeDefinition = {
  type: "function",
  function: {
    name: "base64_decode",
    description: "Decode Base64 encoded text back to original format",
    parameters: {
      type: "object",
      properties: {
        encoded_text: {
          type: "string",
          description: "Base64 encoded text to decode"
        }
      },
      required: ["encoded_text"]
    }
  }
};

async function base64DecodeHandler(args) {
  try {
    const { encoded_text } = args;
    const decoded = Buffer.from(encoded_text, 'base64').toString('utf-8');
    
    return JSON.stringify({
      success: true,
      encoded: encoded_text,
      decoded: decoded,
      length: decoded.length
    });
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message
    });
  }
}

// ============ Tool 3: Hash Text ============
const hashTextDefinition = {
  type: "function",
  function: {
    name: "hash_text",
    description: "Generate cryptographic hash of text using various algorithms (MD5, SHA1, SHA256, SHA512)",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text to hash"
        },
        algorithm: {
          type: "string",
          enum: ["md5", "sha1", "sha256", "sha512"],
          description: "Hashing algorithm to use (default: sha256)"
        }
      },
      required: ["text"]
    }
  }
};

async function hashTextHandler(args) {
  try {
    const { text, algorithm = "sha256" } = args;
    
    const hash = crypto.createHash(algorithm);
    hash.update(text);
    const digest = hash.digest('hex');
    
    return JSON.stringify({
      success: true,
      original: text,
      algorithm: algorithm,
      hash: digest,
      length: digest.length
    });
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message
    });
  }
}

// ============ Plugin Initialization ============
/**
 * Initialize the example plugin
 * This function is called by the plugin loader
 * @param {ToolRegistry} toolRegistry - The tool registry to register tools with
 */
export async function init(toolRegistry) {
  // Register all tools with the registry
  toolRegistry.register(base64EncodeDefinition, base64EncodeHandler);
  toolRegistry.register(base64DecodeDefinition, base64DecodeHandler);
  toolRegistry.register(hashTextDefinition, hashTextHandler);
  
  console.log("   🔧 Example plugin initialized with encoding/hashing tools");
}
