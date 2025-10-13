# CortexOS Release Notes

## Version 1.2.0 - Official Docker Release

### What is CortexOS?

CortexOS is the official Docker image for CortexAI - a comprehensive penetration testing operating system that bundles CortexAI with 100+ pre-installed security tools from Kali Linux. It provides a complete, containerized security testing environment.

## Key Features

### Complete Security Toolkit
- **Base**: Kali Linux Rolling Release
- **AI Agent**: CortexAI with full project management
- **100+ Tools**: Nmap, Metasploit, Burp Suite, SQLMap, Nikto, and more
- **Languages**: Node.js 20.x, Python 3, Go 1.21
- **Wordlists**: Complete Kali and SecLists collections

### Pre-installed Tool Categories

#### Web Application Security
- Burp Suite, SQLMap, Nikto, WPScan, Dirb, Gobuster, FFUF, Feroxbuster
- OWASP ZAP, Commix, WhatWeb, WAFW00F, Skipfish

#### Network Security
- Nmap, Masscan, Zmap, Netdiscover, DNSenum, DNSrecon
- Subfinder, Amass, Sublist3r, Fierce

#### Exploitation
- Metasploit Framework, Exploit-DB, Searchsploit

#### Password & Cracking
- Hydra, Medusa, John the Ripper, Hashcat, Crunch

#### Wireless
- Aircrack-ng, Reaver, Wifite, Kismet

#### Forensics
- Binwalk, Foremost, ExifTool, Volatility3, Steghide

#### Reverse Engineering
- Radare2, Ghidra, GDB

#### Sniffing & Spoofing
- Wireshark, TCPdump, Ettercap, Responder

#### Modern Go Tools
- Nuclei, Subfinder, Httpx, Katana, Naabu, FFUF

## Files Created

### Core Files
1. **Dockerfile** - Main Docker image definition
   - Kali Linux rolling as base
   - 100+ security tools installed
   - CortexAI fully integrated
   - Optimized with multi-stage caching

2. **docker-compose.yml** - Easy deployment configuration
   - Volume persistence
   - Port mappings
   - Resource limits
   - Health checks

3. **.dockerignore** - Build optimization
   - Excludes unnecessary files
   - Reduces build context size

### Build & Test Scripts
4. **build-docker.sh** - Automated build script
   - Version tagging
   - Registry push support
   - Build validation
   - Multi-arch support ready

5. **test-docker.sh** - Comprehensive test suite
   - Validates image build
   - Checks tool availability
   - Verifies directory structure
   - Health check testing

### Documentation
6. **DOCKER.md** - Complete Docker documentation
   - Installation instructions
   - Usage examples
   - Configuration guide
   - Troubleshooting
   - Best practices

7. **QUICKSTART-DOCKER.md** - Quick reference guide
   - Fast setup instructions
   - Common commands
   - Example workflows

8. **RELEASE-NOTES.md** (this file)
   - Version information
   - Feature summary
   - Usage guidelines

### CI/CD
9. **.github/workflows/docker-build.yml** - GitHub Actions workflow
   - Automated builds on push
   - Multi-platform support (amd64, arm64)
   - Security scanning with Trivy
   - Push to GitHub Container Registry and Docker Hub

## Quick Start

### Pull and Run
```bash
# Pull the image
docker pull theelderemo/cortexos:latest

# Run interactively
docker run -it --rm \
  -v $(pwd)/workspace:/opt/workspace \
  theelderemo/cortexos:latest

# Inside container
cortexai
```

### Using Docker Compose
```bash
# Create .env file with API keys
cp .env.template .env
nano .env

# Start container
docker-compose up -d

# Access shell
docker-compose exec cortexos /bin/bash
```

### Build from Source
```bash
# Clone repository
git clone https://github.com/theelderemo/cortexai.git
cd cortexai

# Build image
./build-docker.sh --latest

# Run
docker run -it --rm cortexos:latest
```

## Configuration

### Environment Variables
Create a `.env` file with:

```bash
# Azure OpenAI (recommended)
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=your_deployment
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Or OpenAI
OPENAI_API_KEY=your_key

# CortexAI Settings
CORTEX_ENABLE_FORMATTING=true
CORTEX_AUTO_PROJECT=false
CORTEX_DEBUG=false
```

### Volume Mounts
- `/root/.cortexai` - Projects and configuration
- `/opt/workspace` - Working directory
- `/opt/reports` - Generated reports
- `/opt/wordlists/custom` - Custom wordlists

## Image Details

### Size Optimization
The image is optimized with:
- Multi-stage build process
- Layer caching
- Minimal base system
- Cleaned package caches

Expected size: ~5-8GB (includes all tools)

### Architecture Support
- **linux/amd64** - Full support
- **linux/arm64** - Planned

### Security
- Regular security scans with Trivy
- Based on official Kali Linux images
- No hardcoded credentials
- Security best practices followed

## Common Commands

### Inside Container
```bash
cortexai              # Launch CortexAI
cortex --help         # Show help
check-tools           # Verify tool installation
nmap -sV target.com   # Port scan
sqlmap -u URL         # SQL injection test
metasploit            # Launch Metasploit
```

### Container Management
```bash
# Docker Compose
docker-compose up -d           # Start
docker-compose down            # Stop
docker-compose logs -f         # View logs
docker-compose exec cortexos bash  # Shell access

# Docker CLI
docker run -it cortexos:latest  # Interactive
docker ps                       # List containers
docker stop cortexos            # Stop container
docker rm cortexos              # Remove container
```

## Testing

Run the test suite:
```bash
./test-docker.sh
```

Tests include:
- Docker availability
- Image build success
- Container startup
- Health checks
- Tool availability
- Directory structure
- Python/Go installations
- Wordlist presence

## Deployment Options

### GitHub Container Registry
```bash
docker pull ghcr.io/theelderemo/cortexai/cortexos:latest
```

### Docker Hub
```bash
docker pull theelderemo/cortexos:latest
```

### Private Registry
```bash
export DOCKER_REGISTRY=your-registry.com
./build-docker.sh --push --latest
```

## CI/CD Integration

### GitHub Actions
The included workflow automatically:
- Builds on every push to main
- Runs comprehensive tests
- Scans for vulnerabilities
- Pushes to registries
- Creates multi-arch images

### Manual Workflow Trigger
```bash
# Via GitHub UI: Actions → Build and Publish CortexOS Docker Image → Run workflow
```

## Known Limitations

1. **Size**: Large image due to comprehensive tool collection
2. **Resources**: Requires significant RAM (recommended 8GB+)
3. **Privileged Mode**: Some tools may require `--privileged` flag
4. **Network Access**: Host network mode may be needed for certain scans

## Troubleshooting

### Container Won't Start
```bash
docker logs cortexos
docker-compose logs -f
```

### Tool Not Found
```bash
# Inside container
apt-get update
apt-get install -y tool-name
```

### Permission Issues
```bash
# Run as specific user
docker run --user $(id -u):$(id -g) -it cortexos:latest
```

### API Key Issues
- Verify `.env` file exists and is mounted
- Check API key format and validity
- Ensure endpoint URL is correct

## Upgrading

### Update CortexOS
```bash
# Pull latest image
docker pull theelderemo/cortexos:latest

# Rebuild from source
git pull
./build-docker.sh --no-cache --latest
```

### Update Tools
```bash
# Inside container
apt-get update && apt-get upgrade -y
nuclei -update-templates
```

## Support

- **Documentation**: /opt/cortexai/documentation/
- **Issues**: https://github.com/theelderemo/cortexai/issues
- **Security**: See SECURITY.md
- **Contributing**: See CONTRIBUTING.md

## Legal Notice

⚠️ **IMPORTANT**: CortexOS is designed for **authorized security testing only**.

- Only test systems you own or have explicit permission to test
- Unauthorized access to computer systems is illegal
- Follow responsible disclosure practices
- Comply with all applicable laws and regulations

See [Legal Guidelines](documentation/legal/legal-guidelines.md) for complete information.

## License

CortexOS and CortexAI are licensed under the MIT License.
See LICENSE file for details.

## Credits

**CortexAI**: Created by Christopher Dickinson (2025)
**Base System**: Kali Linux (Offensive Security)
**Tools**: Various open-source security tools (see individual licenses)


### Version History
- **1.2.0** (2025-01-XX) - Initial Docker release
  - Official CortexOS Docker image
  - 100+ pre-installed security tools
  - Complete CI/CD pipeline
  - Comprehensive documentation

## Feedback

I welcome feedback and contributions!

- **Feature Requests**: Open an issue with enhancement label
- **Bug Reports**: Open an issue with bug label
- **Pull Requests**: See CONTRIBUTING.md
- **Discussions**: Use GitHub Discussions

---

**CortexOS v1.2.0** - Your Complete Penetration Testing Platform
*Powered by CortexAI | Built on Kali Linux | Ready for Action*

For more information, visit: https://github.com/theelderemo/cortexai
