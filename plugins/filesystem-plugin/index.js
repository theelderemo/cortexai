/**
 * This file is part of CortexAI.
 *
 * Copyright (c) 2025 Christopher Dickinson
 *
 * CortexAI is licensed under the MIT License.
 * See the LICENSE file in the project root for full license information.
 */

/**
 * Filesystem Plugin for CortexAI
 * Provides file system operations
 */

import fs from 'fs/promises';
import path from 'path';

// ============ Tool 1: Read File ============
const readFileDefinition = {
  type: "function",
  function: {
    name: "read_file",
    description: "Read the contents of a file from the filesystem",
    parameters: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "The absolute or relative path to the file to read"
        }
      },
      required: ["file_path"]
    }
  }
};

async function readFileHandler(args) {
  try {
    const { file_path } = args;
    const absolutePath = path.resolve(file_path);
    const content = await fs.readFile(absolutePath, "utf-8");
    const stats = await fs.stat(absolutePath);
    return JSON.stringify({
      success: true,
      content: content,
      path: absolutePath,
      size: stats.size,
      modified: stats.mtime
    });
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message,
      path: args.file_path
    });
  }
}

// ============ Tool 2: Write File ============
const writeFileDefinition = {
  type: "function",
  function: {
    name: "write_file",
    description: "Write content to a file. Creates the file if it doesn't exist, overwrites if it does.",
    parameters: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "The absolute or relative path to the file to write"
        },
        content: {
          type: "string",
          description: "The content to write to the file"
        }
      },
      required: ["file_path", "content"]
    }
  }
};

async function writeFileHandler(args) {
  try {
    const { file_path, content } = args;
    const absolutePath = path.resolve(file_path);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, content, "utf-8");
    const stats = await fs.stat(absolutePath);
    return JSON.stringify({
      success: true,
      path: absolutePath,
      bytes_written: stats.size
    });
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message,
      path: args.file_path
    });
  }
}

// ============ Tool 3: List Directory ============
const listDirectoryDefinition = {
  type: "function",
  function: {
    name: "list_directory",
    description: "List contents of a directory with details",
    parameters: {
      type: "object",
      properties: {
        directory_path: {
          type: "string",
          description: "The path to the directory to list. Defaults to current directory if not specified."
        }
      },
      required: []
    }
  }
};

async function listDirectoryHandler(args) {
  try {
    const directoryPath = args.directory_path || ".";
    const absolutePath = path.resolve(directoryPath);
    const entries = await fs.readdir(absolutePath, { withFileTypes: true });
    const details = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(absolutePath, entry.name);
        const stats = await fs.stat(fullPath);
        return {
          name: entry.name,
          type: entry.isDirectory() ? "directory" : "file",
          size: stats.size,
          modified: stats.mtime
        };
      })
    );
    return JSON.stringify({
      success: true,
      path: absolutePath,
      entries: details
    });
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message,
      path: args.directory_path || "."
    });
  }
}

// ============ Tool 4: Get Current Working Directory ============
const getCwdDefinition = {
  type: "function",
  function: {
    name: "get_cwd",
    description: "Get the current working directory",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  }
};

function getCwdHandler(args) {
  return JSON.stringify({
    success: true,
    cwd: process.cwd()
  });
}

// ============ Plugin Initialization ============
export async function init(toolRegistry) {
  toolRegistry.register(readFileDefinition, readFileHandler);
  toolRegistry.register(writeFileDefinition, writeFileHandler);
  toolRegistry.register(listDirectoryDefinition, listDirectoryHandler);
  toolRegistry.register(getCwdDefinition, getCwdHandler);
  
  console.log("   📁 Filesystem plugin initialized");
}
