# Quick Start Guide

Get CortexAI running in under 10 minutes with this streamlined setup guide.

## Prerequisites Check

Before starting, ensure you have:

- [ ] **Node.js 18+** installed (`node --version`)
- [ ] **Azure OpenAI** API access
- [ ] **Terminal/Command Prompt** access
- [ ] **Authorization** to test your target systems

## Step 1: Install CortexAI (2 minutes)

```bash
# Clone repository
git clone https://github.com/theelderemo/cortexai.git
cd cortexai

# Install dependencies
npm install
```

## Step 2: Configure Azure OpenAI (3 minutes)

### Get Your Azure OpenAI Details

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your OpenAI resource
3. Copy these values:
   - **Endpoint**: `https://your-resource.openai.azure.com/`
   - **API Key**: From "Keys and Endpoint" section
   - **Deployment Name**: Your GPT-4 deployment name

### Setup Environment

```bash
# Copy template
cp .env.example .env

# Edit configuration (use your preferred editor)
nano .env
```

**Fill in these required values**:
```bash
AZURE_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_MODEL_NAME=gpt-4o
AZURE_DEPLOYMENT=your-deployment-name
AZURE_API_KEY=your-api-key-here
AZURE_API_VERSION=2024-12-01-preview
```

## Step 3: Launch CortexAI (1 minute)

```bash
npm start
```

**Expected Output**:
```
✅ Environment validation passed
🚀 Starting CortexAI...

Project Management System
========================

[1] Create new project
[2] Open existing project
[3] List all projects

Choose an option (1-3):
```

## Step 4: Create Your First Project (2 minutes)

1. **Select "1" - Create new project**

2. **Enter project details**:
   ```
   Project name: MyFirstTest
   Target: example.com
   Description: Learning CortexAI
   ```

3. **Configure scope** (when prompted):
   ```
   Add to scope: https://example.com/*
   Exclude from scope: (press Enter to skip)
   ```

4. **Launch database viewer**: Choose "Yes"

## Step 5: Test Basic Commands (2 minutes)

Once CortexAI loads, try these commands:

```
> "Show me the project status"
```

```
> "What security testing can I perform?"
```

```
> "Help me understand the project scope"
```

## Quick Test Commands

### Check Installation
```
> "What tools are available on this system?"
```

### View Project Structure
```
> "Show me the project database structure"
```

### Basic Reconnaissance (if authorized)
```
> "Perform safe reconnaissance on the target"
```

## Success Indicators

You know CortexAI is working correctly when:

- [ ] No error messages during startup
- [ ] Project created successfully
- [ ] AI responds to natural language commands
- [ ] Database viewer opens (if enabled)
- [ ] Log window shows activity

## Common Issues & Quick Fixes

### "Module not found" Error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Environment validation failed"
```bash
# Check your .env file
cat .env
# Ensure all required variables are set
```

### Azure API Connection Issues
```bash
# Test API connectivity
curl -H "api-key: YOUR_API_KEY" https://your-endpoint.openai.azure.com/
```

### Terminal Formatting Issues
```bash
# Disable formatting if needed
echo "AGENT_DISABLE_FORMATTING=true" >> .env
```

## What's Next?

Now that CortexAI is running:

1. **Read the [User Onboarding Guide](user-onboarding.md)** for comprehensive setup
2. **Review [Legal Guidelines](../legal/legal-guidelines.md)** for responsible use
3. **Explore [Project Management](../project-management/overview.md)** features
4. **Try [Common Workflows](../workflows/common-workflows.md)**

## Need Help?

- **FAQ**: [help/faq.md](../help/faq.md)
- **Troubleshooting**: [help/troubleshooting.md](../help/troubleshooting.md)
- **GitHub Issues**: [Report problems](https://github.com/theelderemo/cortexai/issues)

## Safety Reminder

⚠️ **Always ensure you have authorization before testing any systems.**

CortexAI is designed for ethical penetration testing with proper authorization. Unauthorized testing is illegal and can result in serious consequences.

---

**Total Setup Time**: ~8 minutes

**You're ready to start ethical security testing with CortexAI!** 🔒✨