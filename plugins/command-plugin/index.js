/**
 * This file is part of CortexAI.
 *
 * Copyright (c) 2025 Christopher Dickinson
 *
 * CortexAI is licensed under the MIT License.
 * See the LICENSE file in the project root for full license information.
 */

/**
 * Command Plugin for CortexAI
 * Provides command execution capabilities
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// ============ Tool: Execute Command ============
const executeCommandDefinition = {
  type: "function",
  function: {
    name: "execute_command",
    description: "Execute a bash command on the Ubuntu system. Returns stdout, stderr, and exit code. Use this for running shell commands, installing packages, checking system info, etc.",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The bash command to execute (e.g., 'ls -la', 'pwd', 'cat file.txt')"
        },
        working_directory: {
          type: "string",
          description: "Optional: The directory to execute the command in. Defaults to current working directory."
        }
      },
      required: ["command"]
    }
  }
};

async function executeCommandHandler(args) {
  try {
    const { command, working_directory = process.cwd() } = args;
    const { stdout, stderr } = await execAsync(command, { 
      cwd: working_directory,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    return JSON.stringify({
      success: true,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      working_directory: working_directory
    });
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error.message,
      stdout: error.stdout?.trim() || "",
      stderr: error.stderr?.trim() || "",
      exit_code: error.code
    });
  }
}

// ============ Plugin Initialization ============
export async function init(toolRegistry) {
  toolRegistry.register(executeCommandDefinition, executeCommandHandler);
  
  console.log("   ⚡ Command execution plugin initialized");
}
