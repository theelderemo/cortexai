# CortexOS Docker Documentation

## Overview

CortexOS is a comprehensive penetration testing Docker image that bundles CortexAI with the top security tools from Kali Linux. It provides a complete, ready-to-use security testing environment in a containerized format.

## What's Included

### Base System
- **Kali Linux Rolling Release** - Latest security-focused Linux distribution
- **Node.js 20.x LTS** - For running CortexAI
- **Python 3** with security libraries
- **Go 1.21** with security tools

### CortexAI Features
- AI-powered penetration testing assistant
- Project management and scope tracking
- Evidence collection and vulnerability tracking
- Integration with all included security tools

### Security Tools (100+ Tools)

#### Web Application Security
- Burp Suite, SQLMap, Nikto, WPScan
- Dirb, Gobuster, FFUF, Feroxbuster
- OWASP ZAP, Commix, WhatWeb, WAFW00F

#### Network Security
- Nmap, Masscan, Zmap, Unicornscan
- Netdiscover, ARP-scan, DNSenum, DNSrecon
- Sublist3r, Amass, Subfinder

#### Exploitation Frameworks
- Metasploit Framework
- Exploit-DB, Searchsploit

#### Password Attacks
- Hydra, Medusa, John the Ripper
- Hashcat, Crunch
- Comprehensive wordlists

#### Wireless Security
- Aircrack-ng, Reaver, Wifite, Kismet

#### Forensics & Analysis
- Binwalk, Foremost, ExifTool
- Volatility3, Steghide

#### Reverse Engineering
- Radare2, Ghidra, GDB

#### Sniffing & Spoofing
- Wireshark, TCPdump, Ettercap
- DNSspoof, Responder

#### ProjectDiscovery Tools (Go-based)
- Nuclei (vulnerability scanner)
- Subfinder, Httpx, Katana
- Naabu (port scanner)

#### Information Gathering
- theHarvester, Recon-ng, Maltego
- Fierce, Dmitry, IKE-scan

## Quick Start

### Prerequisites
- Docker installed and running
- At least 8GB RAM available
- 20GB disk space

### Using Docker Compose (Recommended)

1. **Clone the repository:**
```bash
git clone https://github.com/theelderemo/cortexai.git
cd cortexai
```

2. **Configure environment variables:**
```bash
cp .env.template .env
nano .env  # Add your Azure OpenAI or OpenAI API keys
```

3. **Start the container:**
```bash
docker-compose up -d
```

4. **Access the container:**
```bash
docker-compose exec cortexos /bin/bash
```

5. **Run CortexAI:**
```bash
cortexai
```

### Using Docker CLI

1. **Build the image:**
```bash
./build-docker.sh --latest
```

2. **Run the container:**
```bash
docker run -it --rm \
  -v $(pwd)/workspace:/opt/workspace \
  -v $(pwd)/.env:/opt/cortexai/.env:ro \
  --name cortexos \
  cortexos:latest
```

3. **Or run CortexAI directly:**
```bash
docker run -it --rm \
  -v $(pwd)/workspace:/opt/workspace \
  -v $(pwd)/.env:/opt/cortexai/.env:ro \
  cortexos:latest \
  cortexai
```

## Common Usage Patterns

### Interactive Security Testing Session
```bash
docker-compose exec cortexos /bin/bash
# Inside container:
cortexai
# Start a new project and begin testing
```

### One-off Tool Execution
```bash
docker run --rm cortexos:latest nmap -sV target.com
docker run --rm cortexos:latest sqlmap -u "http://target.com?id=1"
```

### Persistent Workspace
```bash
# Create workspace directory
mkdir -p ./workspace

# Run with workspace mounted
docker run -it --rm \
  -v $(pwd)/workspace:/opt/workspace \
  cortexos:latest
```

### Network Scanning
```bash
# Run with host network for full network access
docker run -it --rm --network=host \
  cortexos:latest \
  nmap -sn 192.168.1.0/24
```

### Web Application Testing
```bash
# Forward ports for proxy tools
docker run -it --rm \
  -p 8080:8080 \
  -v $(pwd)/workspace:/opt/workspace \
  cortexos:latest
# Inside: Start Burp Suite or ZAP on port 8080
```

## Volume Mounts

The following directories can be mounted for persistence:

- `/root/.cortexai` - CortexAI projects and configuration
- `/opt/workspace` - Working directory for engagement files
- `/opt/reports` - Generated reports
- `/opt/wordlists/custom` - Custom wordlists
- `/opt/cortexai/.env` - Environment configuration

## Environment Variables

Configure via `.env` file or Docker environment:

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

## Helpful Commands Inside Container

### Check Installed Tools
```bash
check-tools
```

### Quick Tool Access
```bash
cortex          # Launch CortexAI
nmap -sV target.com
sqlmap -u "http://target.com?id=1"
nikto -h target.com
gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt
```

### Common Aliases
```bash
cortex          # CortexAI
scan            # nmap -sV -sC
metasploit      # msfconsole -q
myip            # Get your public IP
ports           # Show listening ports
```

## Building from Source

### Build Script
```bash
# Build only
./build-docker.sh --build-only

# Build and tag as latest
./build-docker.sh --latest

# Build without cache
./build-docker.sh --no-cache

# Build and push to registry
export DOCKER_REGISTRY=your-registry.com
./build-docker.sh --latest --push
```

### Manual Build
```bash
docker build -t cortexos:latest -f Dockerfile .
```

## Troubleshooting

### Container Won't Start
```bash
# Check Docker logs
docker logs cortexos

# Verify health status
docker inspect cortexos | grep -A 10 Health
```

### Permission Issues
```bash
# Run with specific user
docker run --user $(id -u):$(id -g) -it cortexos:latest
```

### Network Issues
```bash
# Use host network mode
docker run --network=host -it cortexos:latest
```

### Missing Tools
```bash
# Update package lists
apt-get update

# Install additional tool
apt-get install -y tool-name
```

## Security Considerations

### Privileged Mode
Some security testing requires privileged mode:
```bash
docker run --privileged -it cortexos:latest
```

⚠️ **Warning:** Only use privileged mode in trusted environments.

### Network Isolation
For maximum security, use Docker networks:
```bash
docker network create pentest-net
docker run --network=pentest-net -it cortexos:latest
```

### API Key Security
Never commit `.env` files with real API keys:
```bash
# .env is in .gitignore by default
echo ".env" >> .gitignore
```

## Performance Optimization

### Resource Limits
Adjust in `docker-compose.yml`:
```yaml
deploy:
  resources:
    limits:
      cpus: '4'
      memory: 8G
```

### Build Cache
Speed up rebuilds by using build cache:
```bash
./build-docker.sh  # Uses cache
./build-docker.sh --no-cache  # Fresh build
```

## Updates and Maintenance

### Update Base Image
```bash
docker pull kalilinux/kali-rolling:latest
./build-docker.sh --no-cache --latest
```

### Update Security Tools
Inside container:
```bash
apt-get update && apt-get upgrade -y
nuclei -update-templates
```

### Update CortexAI
Rebuild with latest code:
```bash
git pull
./build-docker.sh --latest
```

## Integration with CI/CD

### GitLab CI Example
```yaml
build-cortexos:
  stage: build
  script:
    - docker build -t cortexos:$CI_COMMIT_SHA .
    - docker tag cortexos:$CI_COMMIT_SHA cortexos:latest
  only:
    - main
```

### GitHub Actions Example
```yaml
name: Build CortexOS
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: ./build-docker.sh --latest
```

## Support and Contributing

- **Issues:** https://github.com/theelderemo/cortexai/issues
- **Documentation:** /opt/cortexai/documentation/
- **Contributing:** See CONTRIBUTING.md

## Legal Notice

CortexOS is designed for **authorized security testing only**. Always obtain proper authorization before testing any systems. See [Legal Guidelines](documentation/legal/legal-guidelines.md) for more information.

## License

CortexOS and CortexAI are licensed under the MIT License. See LICENSE file for details.

---

**CortexOS - Comprehensive Penetration Testing Operating System**
*Powered by CortexAI v1.2.0*
