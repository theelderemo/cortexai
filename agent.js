import { AzureOpenAI } from "openai";
import readline from "readline";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const execAsync = promisify(exec);

// ============ Terminal Formatting System ============
class TerminalFormatter {
  static formatMarkdown(text) {
    if (!text) return text;
    
    let formatted = text;
    
    // ANSI color codes
    const colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      dim: '\x1b[2m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      gray: '\x1b[90m'
    };
    
    // Headers (### to #)
    formatted = formatted.replace(/^### (.+)$/gm, `${colors.yellow}${colors.bright}▶ $1${colors.reset}`);
    formatted = formatted.replace(/^## (.+)$/gm, `${colors.cyan}${colors.bright}▶▶ $1${colors.reset}`);
    formatted = formatted.replace(/^# (.+)$/gm, `${colors.magenta}${colors.bright}▶▶▶ $1${colors.reset}`);
    
    // Bold text
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, `${colors.bright}$1${colors.reset}`);
    
    // Italic text (convert to underlined since terminals don't always support italic)
    formatted = formatted.replace(/\*(.+?)\*/g, `${colors.dim}$1${colors.reset}`);
    
    // Code blocks (```language and ```)
    formatted = formatted.replace(/```[\w]*\n([\s\S]*?)\n```/g, (match, code) => {
      const lines = code.split('\n');
      const formattedLines = lines.map(line => `${colors.gray}│${colors.reset} ${colors.cyan}${line}${colors.reset}`);
      return `${colors.gray}┌─ Code Block ─────${colors.reset}\n${formattedLines.join('\n')}\n${colors.gray}└─────────────────${colors.reset}`;
    });
    
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, `${colors.cyan}${colors.bright}$1${colors.reset}`);
    
    // Bullet points
    formatted = formatted.replace(/^- (.+)$/gm, `${colors.yellow}●${colors.reset} $1`);
    formatted = formatted.replace(/^\* (.+)$/gm, `${colors.yellow}●${colors.reset} $1`);
    
    // Numbered lists
    formatted = formatted.replace(/^(\d+)\. (.+)$/gm, `${colors.green}$1.${colors.reset} $2`);
    
    // Severity indicators (common in security reports)
    formatted = formatted.replace(/\b(Critical|HIGH|High)\b/g, `${colors.red}${colors.bright}$1${colors.reset}`);
    formatted = formatted.replace(/\b(Medium|MEDIUM)\b/g, `${colors.yellow}${colors.bright}$1${colors.reset}`);
    formatted = formatted.replace(/\b(Low|LOW|Info|INFO)\b/g, `${colors.blue}$1${colors.reset}`);
    
    // Success/Error indicators
    formatted = formatted.replace(/\b(SUCCESS|PASS|PASSED|✓)\b/g, `${colors.green}${colors.bright}$1${colors.reset}`);
    formatted = formatted.replace(/\b(ERROR|FAIL|FAILED|FAILURE|✗)\b/g, `${colors.red}${colors.bright}$1${colors.reset}`);
    formatted = formatted.replace(/\b(WARNING|WARN|⚠)\b/g, `${colors.yellow}${colors.bright}$1${colors.reset}`);
    
    // File paths and URLs
    formatted = formatted.replace(/([\/\w.-]+\.(js|ts|py|txt|json|xml|html|css|php|conf|log))/g, `${colors.magenta}$1${colors.reset}`);
    formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, `${colors.blue}$1${colors.reset}`);
    
    // IP addresses
    formatted = formatted.replace(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g, `${colors.cyan}$1${colors.reset}`);
    
    // Ports
    formatted = formatted.replace(/:(\d{1,5})\b/g, `:${colors.yellow}$1${colors.reset}`);
    
    return formatted;
  }
  
  static formatOutput(content, prefix = "🤖 Assistant") {
    if (!ENABLE_FORMATTING) {
      return `\n${prefix}: ${content}\n`;
    }
    const formatted = this.formatMarkdown(content);
    return `\n${prefix}: ${formatted}\n`;
  }
}

// ============ Logging System ============
class AgentLogger {
  constructor() {
    this.logFile = path.join(os.tmpdir(), 'agent-logs.txt');
    this.logStream = null;
    this.terminalProcess = null;
    this.initLogging();
  }

  async initLogging() {
    try {
      // Clear previous log file
      await fs.writeFile(this.logFile, '');
      
      // Try to open a new terminal window for logs
      await this.openLogTerminal();
      
      // Set up file logging
      this.logStream = await fs.open(this.logFile, 'a');
      
      this.log('SYSTEM', 'Agent Logger initialized');
      this.log('SYSTEM', `Log file: ${this.logFile}`);
    } catch (error) {
      console.error('Failed to initialize logging system:', error.message);
    }
  }

  async openLogTerminal() {
    try {
      // Try different terminal emulators
      const terminals = [
        'gnome-terminal',
        'xterm',
        'konsole',
        'xfce4-terminal',
        'mate-terminal'
      ];

      for (const terminal of terminals) {
        try {
          // Check if terminal is available
          await execAsync(`which ${terminal}`);
          
          // Launch terminal with tail command to follow log file
          const args = this.getTerminalArgs(terminal);
          this.terminalProcess = spawn(terminal, args, {
            detached: true,
            stdio: 'ignore'
          });
          
          this.terminalProcess.unref();
          console.log(`🪟 Opened log terminal using ${terminal}`);
          return;
        } catch (e) {
          // Terminal not available, try next one
          continue;
        }
      }
      
      console.log('⚠️  No suitable terminal found for log window');
    } catch (error) {
      console.log('⚠️  Could not open log terminal:', error.message);
    }
  }

  getTerminalArgs(terminal) {
    const tailCommand = `tail -f ${this.logFile}`;
    
    switch (terminal) {
      case 'gnome-terminal':
        return ['--title=Agent Logs', '--', 'bash', '-c', tailCommand];
      case 'xterm':
        return ['-title', 'Agent Logs', '-e', 'bash', '-c', tailCommand];
      case 'konsole':
        return ['--title', 'Agent Logs', '-e', 'bash', '-c', tailCommand];
      case 'xfce4-terminal':
        return ['--title=Agent Logs', '--command', tailCommand];
      case 'mate-terminal':
        return ['--title=Agent Logs', '--command', tailCommand];
      default:
        return ['-e', 'bash', '-c', tailCommand];
    }
  }

  async log(category, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      category: category.toUpperCase(),
      message,
      data: data ? (typeof data === 'object' ? JSON.stringify(data, null, 2) : data) : null
    };

    const logLine = `[${timestamp}] [${category.toUpperCase()}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}\n`;
    
    try {
      if (this.logStream) {
        await this.logStream.writeFile(logLine);
      }
    } catch (error) {
      console.error('Logging error:', error.message);
    }
  }

  async close() {
    try {
      if (this.logStream) {
        await this.logStream.close();
      }
      if (this.terminalProcess) {
        this.terminalProcess.kill();
      }
      this.log('SYSTEM', 'Agent Logger closed');
    } catch (error) {
      console.error('Error closing logger:', error.message);
    }
  }
}

// Initialize logger
const logger = new AgentLogger();

// ============ Configuration ============
const endpoint = process.env.AZURE_ENDPOINT;
const modelName = process.env.AZURE_MODEL_NAME;
const deployment = process.env.AZURE_DEPLOYMENT;
const apiKey = process.env.AZURE_API_KEY;
const apiVersion = process.env.AZURE_API_VERSION;

// Terminal formatting configuration
const ENABLE_FORMATTING = process.env.AGENT_DISABLE_FORMATTING !== 'true';

const options = { endpoint, apiKey, deployment, apiVersion };
const client = new AzureOpenAI(options);

// Conversation history
const messages = [
  {
    role: "system",
    content: `You are an experienced penetration tester and security analyst with expertise in web application security, OWASP Top 10, and vulnerability assessment, running on Ubuntu Linux with full terminal and computer access.

<role>
- Identify security vulnerabilities through systematic analysis
- Provide proof-of-concept examples where applicable
- Follow responsible disclosure principles
- Execute commands and file operations to support security testing
</role>

<available_tools>
You can:
- Execute commands using the execute_command tool
- Read files using the read_file tool
- Write files using the write_file tool
- List directory contents using the list_directory tool
- Get the current working directory using the get_cwd tool
</available_tools>

<analysis_method>
1. Categorize findings by OWASP Top 10 classification
2. Identify vulnerability type and potential impact
3. Rate severity (Critical/High/Medium/Low)
4. Provide specific remediation with code examples
5. Prioritize findings by exploitability and business risk
6. Use terminal tools to validate findings when applicable
</analysis_method>

<constraints>
- Validate findings before reporting
- For potentially destructive operations (rm, mv to overwrite, etc.), warn the user first
- Use absolute paths when possible for clarity
</constraints>

<persistence>
- Keep analyzing until all attack surfaces are examined
- Research alternative attack vectors when initial paths fail
- Document assumptions and uncertainty levels
- Never stop analysis due to ambiguity—deduce the most reasonable approach
</persistence>

<terminal_workflow>
When executing commands:
- Always explain what you're about to do before calling a tool
- Provide clear explanations of command outputs
- Suggest follow-up actions when appropriate
- Link security findings to specific files/directories when discovered
- Save vulnerability reports and logs to files for documentation
- Get confirmation from the user before executing any commands
</terminal_workflow>

<security_command_examples>
Common security testing commands you can execute:
- nmap for network scanning
- curl/wget for web request analysis
- grep/awk/sed for log analysis and pattern matching
- openssl for certificate and encryption testing
- netcat for connection testing
- Python scripts for custom security tools
- git for repository analysis
</security_command_examples>

<output_structure>
For each finding:
- Title: Brief vulnerability name
- Severity: Critical/High/Medium/Low/Info
- Impact: Business risk description
- Steps to Reproduce: Numbered list with actual commands used
- Command Output: Relevant terminal output (if applicable)
- Remediation: Specific fix recommendation with code examples
- References: CWE/OWASP/CVE links
- Artifacts: File paths to saved reports/logs
</output_structure>

Current user: ${os.userInfo().username}
Current home directory: ${os.homedir()}
Working mode: Security analysis with terminal integration`
  }
];

// ============ Tool Definitions ============
const tools = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  }
];

// ============ Tool Implementations ============
async function executeCommand(command, workingDirectory = process.cwd()) {
  try {
    const { stdout, stderr } = await execAsync(command, { 
      cwd: workingDirectory,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    return JSON.stringify({
      success: true,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      working_directory: workingDirectory
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

async function readFile(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
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
      path: filePath
    });
  }
}

async function writeFile(filePath, content) {
  try {
    const absolutePath = path.resolve(filePath);
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
      path: filePath
    });
  }
}

async function listDirectory(directoryPath = ".") {
  try {
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
      path: directoryPath
    });
  }
}

function getCurrentWorkingDirectory() {
  return JSON.stringify({
    success: true,
    cwd: process.cwd()
  });
}

// ============ Tool Dispatcher ============
async function callTool(toolName, args) {
  if (ENABLE_FORMATTING) {
    console.log(`\n${TerminalFormatter.formatMarkdown('**🔧 Calling tool:**')} \`${toolName}\``);
    console.log(`${TerminalFormatter.formatMarkdown('**📋 Arguments:**')} \`${JSON.stringify(args, null, 2)}\``);
  } else {
    console.log(`\n🔧 Calling tool: ${toolName}`);
    console.log(`📋 Arguments: ${JSON.stringify(args, null, 2)}`);
  }
  
  // Log tool call
  await logger.log('TOOL_CALL', `Executing ${toolName}`, args);
  
  let result;
  switch (toolName) {
    case "execute_command":
      await logger.log('COMMAND', `Executing: ${args.command}`, { 
        working_directory: args.working_directory || process.cwd() 
      });
      result = await executeCommand(args.command, args.working_directory);
      break;
    case "read_file":
      await logger.log('FILE_READ', `Reading file: ${args.file_path}`);
      result = await readFile(args.file_path);
      break;
    case "write_file":
      await logger.log('FILE_WRITE', `Writing to file: ${args.file_path}`, {
        content_length: args.content?.length || 0
      });
      result = await writeFile(args.file_path, args.content);
      break;
    case "list_directory":
      await logger.log('DIRECTORY_LIST', `Listing directory: ${args.directory_path || '.'}`);
      result = await listDirectory(args.directory_path);
      break;
    case "get_cwd":
      await logger.log('GET_CWD', 'Getting current working directory');
      result = getCurrentWorkingDirectory();
      break;
    default:
      await logger.log('ERROR', `Unknown tool: ${toolName}`);
      result = JSON.stringify({ success: false, error: "Unknown tool" });
  }
  
  // Log tool result
  const parsedResult = JSON.parse(result);
  await logger.log('TOOL_RESULT', `${toolName} completed`, {
    success: parsedResult.success,
    error: parsedResult.error || null
  });
  
  if (ENABLE_FORMATTING) {
    console.log(`${TerminalFormatter.formatMarkdown('**✅ Tool result:**')} ${result.substring(0, 200)}${result.length > 200 ? "..." : ""}\n`);
  } else {
    console.log(`✅ Tool result: ${result.substring(0, 200)}${result.length > 200 ? "..." : ""}\n`);
  }
  return result;
}

// ============ Main Conversation Loop ============
async function processMessage(userMessage) {
  await logger.log('USER_INPUT', 'Processing user message', { message: userMessage });
  
  messages.push({
    role: "user",
    content: userMessage
  });

  let continueLoop = true;
  let iterationCount = 0;
  const maxIterations = 10; // Prevent infinite loops

  while (continueLoop && iterationCount < maxIterations) {
    iterationCount++;
    
    await logger.log('AI_REQUEST', `Starting AI request iteration ${iterationCount}`);
    
    // Call the model
    const response = await client.chat.completions.create({
      model: modelName,
      messages: messages,
      tools: tools,
      tool_choice: "auto",
      max_tokens: 16384,
      temperature: 0.7,
    });

    const responseMessage = response.choices[0].message;
    messages.push(responseMessage);

    await logger.log('AI_RESPONSE', 'Received AI response', {
      has_content: !!responseMessage.content,
      has_tool_calls: !!(responseMessage.tool_calls && responseMessage.tool_calls.length > 0),
      tool_calls_count: responseMessage.tool_calls?.length || 0
    });

    // Check if the model wants to call tools
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      await logger.log('TOOL_EXECUTION', `Processing ${responseMessage.tool_calls.length} tool calls`);
      
      // Process all tool calls
      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        // Execute the tool
        const toolResult = await callTool(functionName, functionArgs);
        
        // Add tool result to messages
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: toolResult
        });
      }
      // Continue loop to get final response
    } else {
      // No more tool calls, print the response and exit loop
      if (responseMessage.content) {
        await logger.log('FINAL_RESPONSE', 'Providing final response to user', {
          response_length: responseMessage.content.length
        });
        console.log(TerminalFormatter.formatOutput(responseMessage.content));
      }
      continueLoop = false;
    }
  }

  if (iterationCount >= maxIterations) {
    await logger.log('WARNING', 'Maximum iterations reached');
    console.log("\n⚠️  Maximum iterations reached. Ending conversation turn.\n");
  }
}

// ============ Interactive Terminal ============
async function startInteractiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "💬 You: "
  });

  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║               Pentesters Terminal Agent                    ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("\nType your commands or questions. Type 'exit' or 'quit' to end.");
  console.log("🪟 A separate terminal window will show detailed agent logs.");
  if (ENABLE_FORMATTING) {
    console.log("🎨 Enhanced terminal formatting is enabled.");
    console.log("   Set AGENT_DISABLE_FORMATTING=true to disable formatting.\n");
  } else {
    console.log("📝 Raw text output mode (formatting disabled).\n");
  }
  
  await logger.log('SYSTEM', 'Interactive mode started');
  
  rl.prompt();

  rl.on("line", async (input) => {
    const trimmedInput = input.trim();
    
    if (trimmedInput.toLowerCase() === "exit" || trimmedInput.toLowerCase() === "quit") {
      await logger.log('SYSTEM', 'User requested exit');
      console.log("\n👋 Goodbye!\n");
      await logger.close();
      rl.close();
      process.exit(0);
    }

    if (trimmedInput.length === 0) {
      rl.prompt();
      return;
    }

    try {
      await processMessage(trimmedInput);
    } catch (error) {
      await logger.log('ERROR', 'Error processing message', { 
        error: error.message,
        stack: error.stack 
      });
      console.error(`\n❌ Error: ${error.message}\n`);
    }

    rl.prompt();
  });

  rl.on("close", async () => {
    await logger.log('SYSTEM', 'Terminal closed by user');
    console.log("\n👋 Terminal agent closed.\n");
    await logger.close();
    process.exit(0);
  });
}

// ============ Start the Agent ============
// Validate required environment variables
const requiredEnvVars = {
  'AZURE_ENDPOINT': endpoint,
  'AZURE_MODEL_NAME': modelName,
  'AZURE_DEPLOYMENT': deployment,
  'AZURE_API_KEY': apiKey,
  'AZURE_API_VERSION': apiVersion
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([name, value]) => !value || value === "<your-api-key>")
  .map(([name]) => name);

if (missingVars.length > 0) {
  console.error("❌ Error: Missing required environment variables:");
  missingVars.forEach(varName => {
    console.error(`   ${varName}`);
  });
  console.error("\n💡 Please check your .env file or set these environment variables:");
  console.error("   You can copy the values from .env.example if available");
  process.exit(1);
}

// Add startup logging
setTimeout(async () => {
  await logger.log('STARTUP', 'Agent starting up', {
    endpoint,
    modelName,
    deployment,
    user: os.userInfo().username,
    platform: os.platform(),
    arch: os.arch()
  });
}, 100);

startInteractiveMode().catch(async (error) => {
  await logger.log('FATAL_ERROR', 'Fatal startup error', {
    error: error.message,
    stack: error.stack
  });
  console.error("Fatal error:", error);
  await logger.close();
  process.exit(1);
});
