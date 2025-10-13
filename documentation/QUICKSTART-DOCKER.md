# CortexOS Quick Start Guide

## Installation

### Option 1: Using Docker Compose (Easiest)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/theelderemo/cortexai.git
   cd cortexai
   ```

2. **Configure API keys:**
   ```bash
   cp .env.template .env
   nano .env  # Add your Azure OpenAI or OpenAI API key
   ```

3. **Start CortexOS:**
   ```bash
   docker-compose up -d
   docker-compose exec cortexos /bin/bash
   ```

### Option 2: Build from Source

```bash
git clone https://github.com/theelderemo/cortexai.git
cd cortexai
./build-docker.sh --latest
docker run -it --rm cortexos:latest
```

## First Steps

Once inside the container:

1. **Launch CortexAI:**
   ```bash
   cortexai
   ```

2. **Create your first project:**
   - Choose "Create new project"
   - Enter project details (name, target, description)
   - Set up scope rules
   - Start testing!

3. **Check available tools:**
   ```bash
   check-tools
   ```

## Common Commands

### Inside Container
```bash
cortexai              # Start CortexAI agent
nmap -sV target.com   # Port scan
sqlmap -u URL         # SQL injection test
nikto -h target.com   # Web vulnerability scan
gobuster dir -u URL   # Directory brute force
metasploit            # Launch Metasploit
```

### Managing Container
```bash
# Start container
docker-compose up -d

# Access container shell
docker-compose exec cortexos /bin/bash

# Stop container
docker-compose down

# View logs
docker-compose logs -f
```

## Example Workflow

1. **Start a penetration test:**
   ```bash
   cortexai
   # Create new project
   # Define scope: target.com
   # Start reconnaissance
   ```

2. **Run initial scans:**
   ```bash
   nmap -sV -sC target.com
   whatweb target.com
   ```

3. **Web vulnerability scanning:**
   ```bash
   nikto -h https://target.com
   gobuster dir -u https://target.com -w /usr/share/wordlists/dirb/common.txt
   ```

4. **Ask CortexAI for analysis:**
   ```
   "Analyze the nmap results and suggest next steps"
   "Check for SQL injection in the login form"
   "Generate a report of findings"
   ```

## Need Help?

- **In-container help:** `cortexai --help`
- **Tool verification:** `check-tools`
- **Documentation:** `/opt/cortexai/documentation/`
- **Full Docker docs:** See `DOCKER.md`

## Troubleshooting

**Container won't start?**
```bash
docker-compose logs cortexos
```

**API key issues?**
- Verify `.env` file exists and has correct keys
- Check API endpoint and deployment name

**Tool not found?**
```bash
apt-get update
apt-get install -y tool-name
```

---

**Happy Ethical Hacking! 🛡️**

*Remember: Only test systems you have explicit permission to test.*
