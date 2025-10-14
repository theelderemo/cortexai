# User Onboarding Guide

Welcome to CortexAI! This guide will walk you through everything you need to know to start using CortexAI effectively for ethical penetration testing.

## What is CortexAI?

CortexAI is an AI-powered penetration testing platform that combines:
- **Artificial Intelligence** - AI powered security analysis and guidance
- **Terminal Integration** - Direct command execution and tool integration
- **Project Management** - Structured engagement tracking and evidence collection
- **Ethical Focus** - Built-in guardrails for responsible security testing

## Before You Begin

### Legal Requirements

⚠️ **CRITICAL**: Before using CortexAI, you must:

1. **Have explicit authorization** to test the target systems
2. **Understand your legal obligations** in your jurisdiction
3. **Follow responsible disclosure practices**
4. **Only test systems you own or have written permission to test**

**Unauthorized testing is illegal and can result in serious consequences.**

### Prerequisites

- **Node.js** (version 18 or higher)
- **Azure OpenAI** account and API access
- **Basic command line** knowledge
- **Penetration testing knowledge** (recommended)
- **Security tools** installed on your system (optional but recommended)

## Step 1: Installation

### Clone the Repository

```bash
git clone https://github.com/theelderemo/cortexai.git
cd cortexai
```

### Install Dependencies

```bash
npm install
```

### Verify Installation

```bash
node --version  # Should be 18+
npm list        # Should show all dependencies
```

## Step 2: Azure OpenAI Configuration

### Get Azure OpenAI Access

1. **Create Azure Account**: Sign up at [portal.azure.com](https://portal.azure.com)
2. **Apply for OpenAI Access**: Request access to Azure OpenAI Service
3. **Create OpenAI Resource**: Deploy an OpenAI resource in Azure
4. **Deploy GPT-4 Model**: Create a deployment with GPT-4 or GPT-4o

### Configure Environment

1. **Copy Environment Template**:
   ```bash
   cp .env.example .env
   ```

2. **Edit Configuration**:
   ```bash
   nano .env  # or your preferred editor
   ```

3. **Fill Required Values**:
   ```bash
   # Azure OpenAI Configuration
   AZURE_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_MODEL_NAME=gpt-4o
   AZURE_DEPLOYMENT=your-deployment-name
   AZURE_API_KEY=your-api-key-here
   AZURE_API_VERSION=2024-12-01-preview
   
   # Optional Settings
   AGENT_DISABLE_FORMATTING=false
   ```

### Test Configuration

```bash
npm start
```

If configured correctly, CortexAI will start and prompt you to create a project.

## Step 3: Your First Project

### Project Startup Flow

When you run `npm start`, CortexAI will:

1. **Validate Environment** - Check all required settings
2. **Project Selection** - Create new or open existing project
3. **Project Configuration** - Set up project details and scope
4. **Database Viewer** - Launch real-time monitoring
5. **Agent Interface** - Start the interactive session

### Creating Your First Project

1. **Choose "Create New Project"**
2. **Enter Project Details**:
   - **Project Name**: `My-First-Test`
   - **Target**: `example.com` (or your authorized target)
   - **Description**: `Learning CortexAI basics`

3. **Configure Initial Scope**:
   - Add: `https://example.com/*`
   - Exclude: `/admin/*` (example)

4. **Launch Database Viewer**: Choose "Yes" to monitor activity

### Understanding the Interface

Once your project is created, you'll see:

- **Main Terminal**: Interactive agent interface
- **Log Window**: Real-time activity logging
- **Database Viewer**: Project data monitoring (if enabled)

## Step 4: Basic Usage

### Natural Language Commands

CortexAI understands natural language. Try these examples:

```
> "Show me the project status"
> "Add https://test.example.com to scope"
> "Perform reconnaissance on the target"
> "Check for common vulnerabilities"
> "Show me all discovered assets"
```

### Core Concepts

#### Projects
- **Self-contained** SQLite databases
- **Organized testing** with scope and evidence
- **Audit trails** for all activities
- **Reusable** for ongoing assessments

#### Scope Management
- **Include Rules**: URLs, patterns, CIDR ranges
- **Exclude Rules**: Sensitive areas to avoid
- **Pattern Matching**: Regex and wildcard support
- **Safety Checks**: Prevents out-of-scope testing

#### Asset Discovery
- **Passive Discovery**: From network traffic
- **Active Discovery**: Web crawling and enumeration
- **Hierarchical Mapping**: Organized site structure
- **Automatic Cataloging**: All discovered resources

#### Vulnerability Management
- **Auto-detection**: Common vulnerability patterns
- **Evidence Storage**: HTTP requests/responses
- **OWASP Classification**: Industry-standard categorization
- **Status Tracking**: New, Confirmed, False Positive, etc.

## Step 5: Essential Workflows

### Web Application Assessment

1. **Create Project**:
   ```
   > "Create a new project for testing webapp.example.com"
   ```

2. **Define Scope**:
   ```
   > "Add https://webapp.example.com/* to scope"
   > "Exclude /logout and /admin/sensitive/* from scope"
   ```

3. **Reconnaissance**:
   ```
   > "Perform initial reconnaissance on the target"
   > "Discover hidden directories and files"
   ```

4. **Security Testing**:
   ```
   > "Test for SQL injection vulnerabilities"
   > "Check for XSS vulnerabilities"
   > "Analyze authentication mechanisms"
   ```

5. **Review Findings**:
   ```
   > "Show me all discovered vulnerabilities"
   > "Launch database viewer to review evidence"
   ```

### Network Security Assessment

1. **Create Project**:
   ```
   > "Create a new project for network assessment"
   ```

2. **Define Network Scope**:
   ```
   > "Add 192.168.1.0/24 to scope"
   ```

3. **Network Discovery**:
   ```
   > "Discover active hosts on the network"
   > "Perform service enumeration"
   ```

4. **Vulnerability Scanning**:
   ```
   > "Scan for vulnerable services"
   > "Check for common misconfigurations"
   ```

## Step 6: Safety and Best Practices

### Safety Features

- **Scope Enforcement**: Automatic scope checking
- **Destructive Action Warnings**: Confirmation required
- **Rate Limiting**: Built-in request throttling
- **Audit Logging**: Complete activity tracking

### Best Practices

1. **Always Define Scope**: Set clear boundaries before testing
2. **Start Conservative**: Begin with passive reconnaissance
3. **Monitor Impact**: Watch for service disruption
4. **Document Everything**: Use the built-in evidence collection
5. **Regular Backups**: Export project data regularly

### Common Mistakes to Avoid

- **Testing without permission**
- **Ignoring scope boundaries**
- **Running destructive tests in production**
- **Not documenting findings properly**
- **Sharing sensitive project data**

## Step 7: Getting Help

### Built-in Help

```
> "Help me understand CortexAI commands"
> "What can I do with this project?"
> "Show me available testing techniques"
```

### Documentation

- **FAQ**: [faq.md](../troubleshooting/faq.md)
- **Troubleshooting**: [common-issues.md](../troubleshooting/common-issues.md)
- **Advanced Features**: [Project Management Documentation](../project-management/overview.md)

### Community Support

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community Q&A and sharing
- **Wiki**: Community-contributed guides

## Next Steps

### Explore Advanced Features

1. **Plugin Development**: [Plugin System](../development/plugin-system.md)
2. **Best Practices**: [Best Practices Guide](../user-guide/best-practices.md)
3. **Common Workflows**: [Common Workflows](../user-guide/common-workflows.md)

### Expand Your Knowledge

1. **Security Testing**: Learn advanced penetration testing techniques
2. **Tool Mastery**: Master integrated security tools (Nmap, Burp, etc.)
3. **Automation**: Develop custom testing automation

### Contribute Back

1. **Report Issues**: Help improve CortexAI
2. **Share Workflows**: Document useful techniques
3. **Contribute Code**: Add new features and improvements

## Onboarding Checklist

- [ ] Installed Node.js and dependencies
- [ ] Configured Azure OpenAI access
- [ ] Created and tested environment configuration
- [ ] Created first project successfully
- [ ] Understood scope management concepts
- [ ] Performed basic reconnaissance
- [ ] Reviewed project database structure
- [ ] Read legal and ethical guidelines
- [ ] Bookmarked documentation resources
- [ ] Tested basic natural language commands

## Welcome to the CortexAI Community!

You're now ready to start using CortexAI for ethical penetration testing. Remember to always test responsibly and follow legal guidelines.

If you have questions or need help, don't hesitate to reach out through our documentation, GitHub issues, or community discussions.

Happy (ethical) hacking! 🔒✨
