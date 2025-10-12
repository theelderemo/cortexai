# Installation Guide

Complete installation instructions for CortexAI on all supported platforms.

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+, Debian 11+, Fedora 35+)
- **Node.js**: Version 18.0.0 or higher
- **Memory**: 4GB RAM
- **Storage**: 1GB for installation, additional space for project databases
- **Network**: Internet connection for Azure OpenAI API access

### Recommended Requirements

- **Node.js**: Version 20.0.0 or higher
- **Memory**: 8GB RAM or more
- **Storage**: 5GB+ for projects and evidence
- **Terminal**: Modern terminal emulator with UTF-8 support
- **Screen Resolution**: 1920x1080 or higher for optimal database viewer experience

## Prerequisites

### Required Software

#### Node.js Installation

**Windows**:
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

**macOS**:
```bash
# Using Homebrew
brew install node

# Verify installation
node --version
npm --version
```

**Linux (Ubuntu/Debian)**:
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**Linux (Fedora)**:
```bash
# Using dnf
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version
```

#### Git Installation

**Windows**:
- Download from [git-scm.com](https://git-scm.com/)
- Run the installer

**macOS**:
```bash
brew install git
```

**Linux**:
```bash
# Ubuntu/Debian
sudo apt-get install git

# Fedora
sudo dnf install git
```

### Azure OpenAI Access

Before installing CortexAI, ensure you have:

1. **Azure Account**: Sign up at [portal.azure.com](https://portal.azure.com)
2. **Azure OpenAI Access**: Apply for access (approval may take a few days)
3. **GPT-4 Deployment**: Create an OpenAI resource and deploy GPT-4 or GPT-4o

See [Azure OpenAI Setup](../configuration/azure-openai-setup.md) for detailed instructions.

## Installation Steps

### Step 1: Clone the Repository

```bash
# Clone CortexAI repository
git clone https://github.com/theelderemo/cortexai.git

# Navigate to directory
cd cortexai
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

This will install all dependencies defined in `package.json`, including:
- Azure OpenAI SDK
- SQLite database libraries
- Terminal UI components
- Security tool integrations

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env
```

Edit the `.env` file with your configuration:

```bash
# Required Azure OpenAI Configuration
AZURE_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_MODEL_NAME=gpt-4o
AZURE_DEPLOYMENT=your-deployment-name
AZURE_API_KEY=your-api-key-here
AZURE_API_VERSION=2024-12-01-preview

# Optional Settings
AGENT_DISABLE_FORMATTING=false
```

See [Environment Setup](../configuration/environment-setup.md) for all configuration options.

### Step 4: Verify Installation

```bash
# Test the installation
npm start
```

Expected output:
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

If you see this prompt, installation was successful!

## Platform-Specific Considerations

### Windows

#### PowerShell Execution Policy

If you encounter script execution errors:

```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Windows Terminal Recommended

For the best experience, use Windows Terminal instead of Command Prompt:
- Download from Microsoft Store
- Better UTF-8 support
- Improved rendering for database viewer

#### Long Path Support

Enable long path support for Windows:

```powershell
# Run as Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

### macOS

#### Command Line Tools

Ensure Xcode Command Line Tools are installed:

```bash
xcode-select --install
```

#### Terminal App

Native Terminal.app works well, but consider alternatives:
- iTerm2 for advanced features
- Hyper for cross-platform consistency

#### Homebrew Permissions

If you encounter permission issues:

```bash
# Fix Homebrew permissions
sudo chown -R $(whoami) /usr/local/bin /usr/local/lib /usr/local/share
```

### Linux

#### Terminal Emulators

Recommended terminal emulators:
- GNOME Terminal
- Konsole
- Terminator
- Alacritty

#### Node.js Version Management

Consider using `nvm` for managing Node.js versions:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20
```

#### SQLite Dependencies

Most Linux distributions include SQLite, but if needed:

```bash
# Ubuntu/Debian
sudo apt-get install sqlite3 libsqlite3-dev

# Fedora
sudo dnf install sqlite sqlite-devel
```

## Optional Security Tools

For full functionality, install these security tools:

### Network Tools

```bash
# Ubuntu/Debian
sudo apt-get install nmap netcat-traditional dnsutils

# macOS
brew install nmap netcat

# Fedora
sudo dnf install nmap nmap-ncat bind-utils
```

### Web Security Tools

```bash
# Ubuntu/Debian
sudo apt-get install nikto dirb gobuster

# macOS
brew install nikto gobuster

# Fedora
sudo dnf install nikto
```

### Additional Tools

- **Burp Suite**: Download from [portswigger.net](https://portswigger.net/)
- **OWASP ZAP**: Download from [zaproxy.org](https://www.zaproxy.org/)
- **SQLMap**: Install via package manager or from GitHub
- **Metasploit**: Download from [metasploit.com](https://www.metasploit.com/)

CortexAI can execute any command-line tool installed on your system.

## Post-Installation

### Create Projects Directory

The projects directory is created automatically on first run, but you can create it manually:

```bash
mkdir -p projects
```

### Test Configuration

Run a configuration test:

```bash
npm start
```

Then try creating a test project to verify everything works.

### Update CortexAI

To update to the latest version:

```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies (if package.json changed)
npm install
```

## Troubleshooting Installation

### "Module not found" Errors

```bash
# Clear npm cache
npm cache clean --force

# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "EACCES" Permission Errors

```bash
# Fix npm permissions (Linux/macOS)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### "node-gyp" Build Errors

```bash
# Windows
npm install --global windows-build-tools

# macOS
xcode-select --install

# Linux (Ubuntu/Debian)
sudo apt-get install build-essential
```

### SQLite Errors

```bash
# Rebuild native modules
npm rebuild sqlite3

# Or force reinstall
npm uninstall sqlite3
npm install sqlite3
```

### Network/Proxy Issues

If behind a corporate proxy:

```bash
# Set npm proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Set environment variables
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

## Uninstallation

To remove CortexAI:

```bash
# Navigate to installation directory
cd cortexai

# Backup project data (optional)
cp -r projects ~/cortexai-projects-backup

# Remove installation
cd ..
rm -rf cortexai
```

Note: This will not remove:
- Node.js installation
- Security tools installed separately
- npm global packages

## Next Steps

After successful installation:

1. **Configure Azure OpenAI**: [Azure OpenAI Setup](../configuration/azure-openai-setup.md)
2. **Complete Onboarding**: [User Onboarding Guide](user-onboarding.md)
3. **Create First Project**: [First Project Guide](first-project.md)
4. **Review Legal Guidelines**: [Legal Guidelines](../legal/legal-guidelines.md)

## Getting Help

If you encounter installation issues:

- Check [Troubleshooting Guide](../help/troubleshooting.md)
- Review [FAQ](../help/faq.md)
- Open an issue on [GitHub](https://github.com/theelderemo/cortexai/issues)

---

**Installation Time**: Approximately 10-15 minutes

**Ready to start?** Continue to [Configuration](../configuration/environment-setup.md).
