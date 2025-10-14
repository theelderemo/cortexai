# Frequently Asked Questions (FAQ)

Find quick answers to common questions about CortexAI.

## General Questions

### What is CortexAI?

CortexAI is an AI-powered penetration testing platform that combines artificial intelligence, terminal integration, and project management to assist with ethical security testing and vulnerability analysis.

### Is CortexAI free to use?

CortexAI itself is open source and free under the MIT license. However, you need an Azure OpenAI API subscription to power the AI features, which has associated costs.

### What makes CortexAI different from other security tools?

- **AI-Powered Analysis**: Uses GPT-4 for intelligent security guidance
- **Natural Language Interface**: Command using plain English
- **Integrated Project Management**: Built-in engagement tracking and evidence collection
- **Ethical Focus**: Designed with safety guardrails for responsible testing
- **Terminal Integration**: Direct execution of security tools

### Can I use CortexAI for bug bounty hunting?

Yes, CortexAI is excellent for bug bounty programs, provided you:
- Only test in-scope targets
- Follow the program's rules and guidelines
- Use responsible disclosure practices
- Maintain proper documentation and evidence

## Installation & Setup

### What are the system requirements?

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 18 or higher
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 1GB for installation, additional space for project data
- **Network**: Internet connection for Azure OpenAI API

### I'm getting "Module not found" errors. How do I fix this?

1. Ensure you're in the correct directory:
   ```bash
   cd cortexai
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check Node.js version:
   ```bash
   node --version  # Should be 18+
   ```

### How do I get Azure OpenAI access?

1. Create an Azure account at [portal.azure.com](https://portal.azure.com)
2. Apply for Azure OpenAI Service access (approval required)
3. Create an OpenAI resource in Azure
4. Deploy a GPT-4 model
5. Get the endpoint, API key, and deployment details

### Can I use OpenAI instead of Azure OpenAI?

Currently, CortexAI is designed for Azure OpenAI. OpenAI API support may be added in future versions. Azure OpenAI is recommended for enterprise use due to better privacy and compliance features.

## Configuration Issues

### CortexAI won't start - "Environment validation failed"

This means required environment variables are missing or invalid:

1. Check your `.env` file exists:
   ```bash
   ls -la .env
   ```

2. Verify all required variables are set:
   ```bash
   cat .env
   ```

3. Required variables:
   - `AZURE_ENDPOINT`
   - `AZURE_MODEL_NAME`
   - `AZURE_DEPLOYMENT`
   - `AZURE_API_KEY`
   - `AZURE_API_VERSION`

### I'm getting API authentication errors

1. **Verify API Key**: Check it's correctly copied from Azure
2. **Check Endpoint**: Ensure it matches your Azure resource
3. **Confirm Deployment**: Verify the deployment name is correct
4. **Test Connectivity**: Try accessing the endpoint directly

### The terminal formatting looks broken

If terminal output appears garbled:

1. **Disable Formatting**:
   ```bash
   echo "AGENT_DISABLE_FORMATTING=true" >> .env
   ```

2. **Update Terminal**: Use a modern terminal emulator
3. **Check Encoding**: Ensure UTF-8 support

## Project Management

### How do I create a new project?

When you start CortexAI, it will prompt you to create or open a project. You can also use:
```
> "Create a new project called MyTest"
```

### Where are project files stored?

Projects are stored in the `projects/` directory as SQLite databases:
```
projects/
├── MyTest.db
├── WebApp-Assessment.db
└── Network-Scan.db
```

### Can I export project data?

Yes, project data is stored in standard SQLite format. You can:
1. Copy the `.db` file for backup
2. Use SQLite browser tools for export
3. Query directly with SQL commands

### How do I delete a project?

Currently, project deletion must be done manually:
```bash
rm projects/ProjectName.db
```

A built-in deletion feature is planned for future releases.

### What happens if I lose my project file?

Project files contain all your testing data. Always:
- Backup project files regularly
- Store backups securely (they contain sensitive data)
- Consider version control for project configurations

## Scope Management

### How do I define testing scope?

```
> "Add https://example.com/* to scope"
> "Include 192.168.1.0/24 in testing scope"
> "Exclude /admin/* from scope"
```

### What scope patterns are supported?

- **URLs**: `https://example.com/path/*`
- **Wildcards**: `*.example.com`
- **Regex**: `/api/v[0-9]+/.*`
- **CIDR**: `192.168.1.0/24`
- **IP Ranges**: `192.168.1.1-192.168.1.100`

### How does scope enforcement work?

CortexAI checks all targets against scope rules before testing:
- **Include Rules**: Must match to be tested
- **Exclude Rules**: Override include rules
- **Safety Checks**: Warns before out-of-scope actions

### Can I modify scope after starting?

Yes, you can add or remove scope rules anytime:
```
> "Remove https://staging.example.com from scope"
> "Add new subdomain https://api.example.com to scope"
```

## Security Testing

### What security tools are supported?

CortexAI can execute any command-line security tool installed on your system:
- **Nmap**: Network scanning and service discovery
- **Burp Suite**: Web application testing (CLI)
- **Nikto**: Web server scanning
- **SQLMap**: SQL injection testing
- **Gobuster/Dirb**: Directory enumeration
- **Custom Scripts**: Python, Bash, PowerShell

### How do I run custom security tools?

```
> "Run nmap scan on 192.168.1.1"
> "Execute nikto scan on https://example.com"
> "Use gobuster to find hidden directories"
> "Run my custom Python scanner script"
```

### Does CortexAI perform automatic exploitation?

No, CortexAI focuses on reconnaissance and vulnerability identification. It will:
- Identify potential vulnerabilities
- Suggest exploitation techniques
- Help with proof-of-concept development
- Provide remediation guidance

Actual exploitation requires explicit user commands.

### How accurate is the vulnerability detection?

CortexAI combines:
- **Tool Output Analysis**: Parses results from security tools
- **Pattern Recognition**: Identifies common vulnerability indicators
- **AI Analysis**: GPT-4 powered assessment
- **False Positive Filtering**: Reduces noise in results

Always manually verify findings before reporting.

## Performance & Optimization

### CortexAI is running slowly. How can I optimize it?

1. **Check System Resources**:
   ```bash
   htop  # Monitor CPU and memory usage
   ```

2. **Optimize API Usage**:
   - Reduce concurrent requests
   - Use more specific queries
   - Enable request caching

3. **Database Optimization**:
   - Regular database cleanup
   - Limit evidence storage
   - Archive old projects

### How much does the Azure OpenAI API cost?

Costs vary by:
- **Model Type**: GPT-4 costs more than GPT-3.5
- **Usage Volume**: Charged per token
- **Region**: Prices vary by Azure region

Typical usage for security testing: $10-50/month for moderate use.

### Can I limit API usage to control costs?

Currently, no built-in limits exist, but you can:
- Monitor usage in Azure portal
- Set Azure spending limits
- Use shorter, more focused queries
- Disable auto-analysis features

## Troubleshooting

### CortexAI crashes when executing commands

1. **Check Command Validity**:
   ```bash
   which nmap  # Verify tool is installed
   ```

2. **Review Logs**:
   - Check the log window for errors
   - Look for permission issues

3. **Test Manually**:
   ```bash
   nmap -version  # Test tool directly
   ```

### Database errors when starting projects

1. **Check Permissions**:
   ```bash
   ls -la projects/
   ```

2. **Remove Corrupted Database**:
   ```bash
   mv projects/ProjectName.db projects/ProjectName.db.backup
   ```

3. **Recreate Project**:
   Start CortexAI and create a new project

### Network connectivity issues

1. **Test Azure Connectivity**:
   ```bash
   curl -I https://your-endpoint.openai.azure.com
   ```

2. **Check Firewall**:
   - Allow outbound HTTPS (443)
   - Whitelist Azure OpenAI endpoints

3. **Proxy Configuration**:
   Set proxy environment variables if needed

## Legal & Ethical Questions

### Is it legal to use CortexAI?

CortexAI is legal when used for authorized testing only:
- ✅ **Your own systems**
- ✅ **Authorized penetration testing**
- ✅ **Bug bounty programs**
- ✅ **Research with permission**
- ❌ **Unauthorized third-party systems**

### What permissions do I need for testing?

You need:
- **Written authorization** for client systems
- **Signed scope of work** defining boundaries
- **Bug bounty program participation** for public programs
- **System ownership** for your own infrastructure

### How do I ensure responsible disclosure?

1. **Document Findings**: Use CortexAI's evidence collection
2. **Verify Impact**: Confirm vulnerabilities are real
3. **Follow Timelines**: Respect disclosure timelines
4. **Communicate Clearly**: Provide detailed, actionable reports
5. **Avoid Public Disclosure**: Until appropriate time

## Advanced Features

### Can I customize CortexAI's behavior?

Yes, through:
- **Environment Variables**: Configure basic behavior
- **Custom Scripts**: Add new testing capabilities
- **Project Templates**: Reuse configurations
- **Tool Integration**: Connect external tools

### How do I add new security tools?

CortexAI can execute any command-line tool:
1. Install the tool on your system
2. Ensure it's in your PATH
3. Use natural language to execute it

### Can I integrate CortexAI with CI/CD pipelines?

Currently, CortexAI is designed for interactive use. CI/CD integration features are planned for future releases.

### How do I contribute to CortexAI development?

1. **Report Bugs**: Use GitHub issues
2. **Suggest Features**: Submit enhancement requests
3. **Submit Code**: Create pull requests
4. **Improve Documentation**: Help expand guides
5. **Share Workflows**: Document useful techniques

## Getting More Help

### Where can I find more documentation?

- **Troubleshooting Guide**: [common-issues.md](common-issues.md)
- **Configuration Reference**: [reference/configuration-reference.md](../reference/configuration-reference.md)
- **API Documentation**: [development/api-reference.md](../development/api-reference.md)
- **Best Practices**: [best-practices.md](../user-guide/best-practices.md)

### How do I report bugs or request features?

1. **Check Existing Issues**: Search [GitHub Issues](https://github.com/theelderemo/cortexai/issues)
2. **Create New Issue**: Provide detailed information
3. **Include Logs**: Attach relevant log files (redact sensitive data)
4. **Describe Steps**: How to reproduce the issue

### Is there a community forum or chat?

Currently, the main communication channels are:
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Community Q&A
- **Pull Requests**: Code contributions and reviews

### Can I get professional support?

CortexAI is currently a community project. Professional support options may be available in the future.

---

**Didn't find your answer?** Check our [Troubleshooting Guide](troubleshooting.md) or open an issue on [GitHub](https://github.com/theelderemo/cortexai/issues).