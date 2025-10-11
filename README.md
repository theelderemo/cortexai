# Penetration Testing Terminal Agent

An intelligent terminal agent powered by GPT for security testing and penetration testing tasks.

## Features

- **Terminal Tool Integration**: Execute commands, read/write files, and navigate directories
- **Enhanced Terminal Formatting**: Beautiful markdown rendering in the terminal
- **Security-Focused Prompts**: Specialized for penetration testing workflows
- **Comprehensive Logging**: Separate terminal window for detailed logs

## Terminal Formatting

The agent now includes enhanced terminal formatting that converts markdown responses into beautifully formatted terminal output:

### Formatting Features

- **Headers**: Color-coded with `▶` symbols
- **Bold Text**: Bright formatting for `**bold**` text
- **Code Blocks**: Boxed code sections with syntax highlighting
- **Inline Code**: Highlighted `code` snippets
- **Bullet Points**: Styled with `●` symbols
- **Severity Levels**: Color-coded security findings (Critical=Red, Medium=Yellow, Low=Blue)
- **File Paths**: Highlighted file and URL references
- **IP Addresses & Ports**: Network-specific highlighting

### Example Output

Instead of seeing raw markdown like:
```
**Critical**: SQL injection found in `/login.php`
- Impact: **High** - Database compromise possible
- `curl -X POST http://target.com/login.php -d "username=admin' OR 1=1--"`
```

You'll see beautifully formatted terminal output with colors and styling.

## Configuration

### Environment Variables
The application uses environment variables for configuration. Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Required environment variables:
- `AZURE_ENDPOINT`: Your Azure Cognitive Services endpoint
- `AZURE_MODEL_NAME`: The model name (e.g., gpt-4o)
- `AZURE_DEPLOYMENT`: Your deployment name
- `AZURE_API_KEY`: Your Azure OpenAI API key
- `AZURE_API_VERSION`: API version (e.g., 2024-12-01-preview)

### Disable Formatting
If you prefer raw markdown output, set the environment variable:
```bash
export AGENT_DISABLE_FORMATTING=true
```
Or add it to your `.env` file:
```
AGENT_DISABLE_FORMATTING=true
```

## Usage

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Azure OpenAI credentials
```

3. Start the agent:
```bash
npm start
```

## Commands

- Type your security testing questions or commands
- Use `exit` or `quit` to close the agent
- The agent can execute terminal commands, analyze files, and provide security insights

## Tool Capabilities

- **execute_command**: Run bash commands
- **read_file**: Read file contents
- **write_file**: Create or modify files
- **list_directory**: Browse directory contents
- **get_cwd**: Get current working directory

## Security Focus

This agent is designed specifically for ethical penetration testing and security analysis:
- OWASP Top 10 categorization
- Vulnerability assessment workflows
- Security tool integration
- Responsible disclosure principles