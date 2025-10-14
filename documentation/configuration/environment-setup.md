# Environment Setup

Configure your CortexAI environment for optimal performance and security.

## Overview

This guide covers all environment configuration options for CortexAI, from basic setup to advanced customization.

## Environment File Structure

CortexAI uses a `.env` file for configuration. This file should be placed in the root directory of the CortexAI installation.

### Creating the Environment File

```bash
# Copy the example template
cp .env.example .env

# Edit with your preferred editor
nano .env
# or
vim .env
# or
code .env
```

## Required Configuration

### Azure OpenAI Settings

These settings are mandatory for CortexAI to function:

```bash
# Azure OpenAI Endpoint
AZURE_ENDPOINT=https://your-resource.openai.azure.com/

# Model name (GPT-4 or GPT-4o recommended)
AZURE_MODEL_NAME=gpt-4o

# Your deployment name from Azure
AZURE_DEPLOYMENT=your-deployment-name

# Azure OpenAI API key
AZURE_API_KEY=your-api-key-here

# API version (use latest available)
AZURE_API_VERSION=2024-12-01-preview
```

**Finding Your Values**:

1. **AZURE_ENDPOINT**: 
   - Go to Azure Portal
   - Navigate to your OpenAI resource
   - Copy the endpoint URL from "Keys and Endpoint"

2. **AZURE_DEPLOYMENT**:
   - In your OpenAI resource
   - Go to "Model deployments"
   - Copy your GPT-4 deployment name

3. **AZURE_API_KEY**:
   - In "Keys and Endpoint" section
   - Copy either Key 1 or Key 2

4. **AZURE_API_VERSION**:
   - Use the version shown in Azure documentation
   - Current recommended: `2024-12-01-preview`

See [Azure OpenAI Setup](azure-openai-setup.md) for detailed Azure configuration.

## Optional Configuration

### Agent Behavior

```bash
# Disable terminal formatting (for compatibility)
AGENT_DISABLE_FORMATTING=false

# Enable verbose logging
AGENT_VERBOSE_MODE=false

# Set agent response timeout (seconds)
AGENT_TIMEOUT=300
```

### Project Management

```bash
# Default projects directory
PROJECTS_DIR=./projects

# Enable automatic database backups
AUTO_BACKUP_ENABLED=true

# Backup interval (hours)
BACKUP_INTERVAL=24
```

### Database Configuration

```bash
# Database viewer port
DB_VIEWER_PORT=8080

# Enable database viewer auto-launch
DB_VIEWER_AUTO_LAUNCH=true

# Database connection timeout
DB_TIMEOUT=30
```

### Logging Configuration

```bash
# Enable detailed logging
ENABLE_DETAILED_LOGS=true

# Log file location
LOG_FILE=./logs/cortexai.log

# Log level (error, warn, info, debug)
LOG_LEVEL=info

# Maximum log file size (MB)
MAX_LOG_SIZE=100
```

### Security Settings

```bash
# Require confirmation for destructive actions
REQUIRE_CONFIRMATIONS=true

# Enable scope enforcement
ENFORCE_SCOPE=true

# Rate limiting (requests per second)
RATE_LIMIT=5

# Maximum concurrent operations
MAX_CONCURRENT_OPS=3
```

### Network Configuration

```bash
# HTTP/HTTPS proxy settings
HTTP_PROXY=http://proxy.company.com:8080
HTTPS_PROXY=http://proxy.company.com:8080

# No proxy exceptions
NO_PROXY=localhost,127.0.0.1,.local

# Connection timeout (seconds)
CONNECTION_TIMEOUT=30

# Request retry attempts
MAX_RETRIES=3
```

## Environment Templates

### Development Environment

```bash
# Development configuration
AZURE_ENDPOINT=https://dev-openai.openai.azure.com/
AZURE_MODEL_NAME=gpt-4o
AZURE_DEPLOYMENT=dev-deployment
AZURE_API_KEY=dev-api-key
AZURE_API_VERSION=2024-12-01-preview

AGENT_VERBOSE_MODE=true
ENABLE_DETAILED_LOGS=true
LOG_LEVEL=debug
REQUIRE_CONFIRMATIONS=true
ENFORCE_SCOPE=true
```

### Production Environment

```bash
# Production configuration
AZURE_ENDPOINT=https://prod-openai.openai.azure.com/
AZURE_MODEL_NAME=gpt-4o
AZURE_DEPLOYMENT=prod-deployment
AZURE_API_KEY=prod-api-key
AZURE_API_VERSION=2024-12-01-preview

AGENT_VERBOSE_MODE=false
ENABLE_DETAILED_LOGS=true
LOG_LEVEL=info
REQUIRE_CONFIRMATIONS=true
ENFORCE_SCOPE=true
RATE_LIMIT=5
MAX_CONCURRENT_OPS=3
AUTO_BACKUP_ENABLED=true
```

### Testing Environment

```bash
# Testing/Lab configuration
AZURE_ENDPOINT=https://test-openai.openai.azure.com/
AZURE_MODEL_NAME=gpt-4o
AZURE_DEPLOYMENT=test-deployment
AZURE_API_KEY=test-api-key
AZURE_API_VERSION=2024-12-01-preview

AGENT_VERBOSE_MODE=true
ENABLE_DETAILED_LOGS=true
LOG_LEVEL=debug
REQUIRE_CONFIRMATIONS=false
ENFORCE_SCOPE=false
```

## Platform-Specific Configuration

### Windows

```bash
# Windows-specific paths
PROJECTS_DIR=C:\Users\YourName\CortexAI\projects
LOG_FILE=C:\Users\YourName\CortexAI\logs\cortexai.log

# Windows line endings
LINE_ENDING=CRLF

# Windows terminal settings
AGENT_DISABLE_FORMATTING=false
TERMINAL_WIDTH=120
```

### macOS

```bash
# macOS-specific paths
PROJECTS_DIR=~/CortexAI/projects
LOG_FILE=~/CortexAI/logs/cortexai.log

# macOS terminal settings
TERMINAL_WIDTH=140
ENABLE_COLORS=true
```

### Linux

```bash
# Linux-specific paths
PROJECTS_DIR=~/cortexai/projects
LOG_FILE=~/cortexai/logs/cortexai.log

# Linux terminal settings
TERMINAL_WIDTH=140
ENABLE_COLORS=true
SHELL=/bin/bash
```

## Validating Configuration

### Configuration Check

Run CortexAI to validate your configuration:

```bash
npm start
```

Expected output for valid configuration:
```
✅ Environment validation passed
🚀 Starting CortexAI...
```

### Manual Validation

Test individual configuration values:

```bash
# Check if .env exists
test -f .env && echo "✅ .env file found" || echo "❌ .env file missing"

# Verify required variables
grep -q "AZURE_ENDPOINT" .env && echo "✅ AZURE_ENDPOINT set" || echo "❌ AZURE_ENDPOINT missing"
grep -q "AZURE_API_KEY" .env && echo "✅ AZURE_API_KEY set" || echo "❌ AZURE_API_KEY missing"
```

### API Connectivity Test

Test Azure OpenAI connectivity:

```bash
# Test API endpoint (replace with your values)
curl -H "api-key: YOUR_API_KEY" \
     "https://your-endpoint.openai.azure.com/openai/deployments?api-version=2024-12-01-preview"
```

Expected response: JSON list of deployments

## Security Best Practices

### Protecting Credentials

**Never commit `.env` to version control**:

```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore
```

### File Permissions

Set appropriate file permissions:

```bash
# Linux/macOS - restrict access to owner only
chmod 600 .env

# Verify permissions
ls -la .env
# Should show: -rw------- (600)
```

### API Key Rotation

Regularly rotate your Azure OpenAI API keys:

1. Generate new key in Azure Portal
2. Update `.env` with new key
3. Test connectivity
4. Delete old key in Azure Portal

### Environment Variables

For additional security, use system environment variables:

```bash
# Linux/macOS - set temporarily
export AZURE_API_KEY="your-api-key"

# Linux/macOS - set permanently
echo 'export AZURE_API_KEY="your-api-key"' >> ~/.bashrc
source ~/.bashrc

# Windows PowerShell - set temporarily
$env:AZURE_API_KEY="your-api-key"

# Windows PowerShell - set permanently
[Environment]::SetEnvironmentVariable("AZURE_API_KEY", "your-api-key", "User")
```

CortexAI will use system environment variables if they exist, overriding `.env` values.

## Troubleshooting

### Configuration Not Loading

**Issue**: Changes to `.env` not taking effect

**Solutions**:
- Restart CortexAI completely
- Verify file is named `.env` (not `.env.txt`)
- Check for syntax errors in `.env`
- Ensure no trailing spaces in values

### Environment Validation Failed

**Issue**: CortexAI reports validation failure

**Solutions**:
```bash
# Check required variables
cat .env | grep "AZURE_"

# Look for empty values
cat .env | grep "=$"

# Verify file format
file .env
# Should show: ASCII text
```

### API Connection Errors

**Issue**: Cannot connect to Azure OpenAI

**Solutions**:
- Verify endpoint URL is correct
- Check API key is valid
- Ensure no firewall blocking
- Test with curl command
- Verify API version is supported

### Path Issues

**Issue**: CortexAI cannot find projects directory

**Solutions**:
```bash
# Create projects directory
mkdir -p projects

# Use absolute paths
PROJECTS_DIR=/full/path/to/projects

# Check permissions
ls -la projects/
```

## Advanced Configuration

### Custom Database Location

```bash
# Store projects on external drive
PROJECTS_DIR=/mnt/external/cortexai-projects

# Network storage
PROJECTS_DIR=/mnt/nas/security/cortexai
```

### Multiple Configurations

Manage multiple environments:

```bash
# Create environment-specific files
cp .env .env.production
cp .env .env.development

# Switch configurations
cp .env.production .env
npm start
```

### Configuration Management Script

Create a configuration switcher:

```bash
#!/bin/bash
# config-switch.sh

case $1 in
  prod)
    cp .env.production .env
    echo "Switched to production"
    ;;
  dev)
    cp .env.development .env
    echo "Switched to development"
    ;;
  *)
    echo "Usage: ./config-switch.sh [prod|dev]"
    ;;
esac
```

### Environment Variable Precedence

CortexAI uses this precedence order:

1. System environment variables (highest priority)
2. `.env` file
3. Default values (lowest priority)

## Configuration Reference

### Complete Example

```bash
# ==========================================
# CortexAI Configuration
# ==========================================

# ----- Required Settings -----
AZURE_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_MODEL_NAME=gpt-4o
AZURE_DEPLOYMENT=your-deployment-name
AZURE_API_KEY=your-api-key-here
AZURE_API_VERSION=2024-12-01-preview

# ----- Agent Behavior -----
AGENT_DISABLE_FORMATTING=false
AGENT_VERBOSE_MODE=false
AGENT_TIMEOUT=300

# ----- Project Management -----
PROJECTS_DIR=./projects
AUTO_BACKUP_ENABLED=true
BACKUP_INTERVAL=24

# ----- Database -----
DB_VIEWER_PORT=8080
DB_VIEWER_AUTO_LAUNCH=true
DB_TIMEOUT=30

# ----- Logging -----
ENABLE_DETAILED_LOGS=true
LOG_FILE=./logs/cortexai.log
LOG_LEVEL=info
MAX_LOG_SIZE=100

# ----- Security -----
REQUIRE_CONFIRMATIONS=true
ENFORCE_SCOPE=true
RATE_LIMIT=5
MAX_CONCURRENT_OPS=3

# ----- Network -----
CONNECTION_TIMEOUT=30
MAX_RETRIES=3
```

## Next Steps

After configuring your environment:

1. **Setup Azure OpenAI**: [Azure OpenAI Setup](azure-openai-setup.md)
2. **Advanced Configuration**: [Advanced Configuration](advanced-configuration.md)
3. **Create Your First Project**: [First Project](../getting-started/first-project.md)

## Getting Help

For configuration assistance:

- **FAQ**: [faq.md](../troubleshooting/faq.md)
- **Troubleshooting**: [common-issues.md](../troubleshooting/common-issues.md)
- **GitHub Issues**: [Report problems](https://github.com/theelderemo/cortexai/issues)

---

**Security Reminder**: Always protect your `.env` file and never share your API keys.
