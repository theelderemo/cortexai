# CortexOS - Comprehensive Penetration Testing Docker Image
# Based on Kali Linux Rolling Release with CortexAI and Top Security Tools
# Created by Christopher Dickinson (2025)

FROM kalilinux/kali-rolling:latest

LABEL maintainer="Christopher Dickinson"
LABEL description="CortexOS - CortexAI with comprehensive security testing toolkit"
LABEL version="1.2.0"

ENV DEBIAN_FRONTEND=noninteractive \
    NODE_VERSION=20 \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    TERM=xterm-256color \
    CORTEX_HOME=/opt/cortexai \
    PATH="/opt/cortexai:${PATH}"

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    wget curl git vim nano unzip zip ca-certificates \
    gnupg2 software-properties-common apt-transport-https \
    build-essential pkg-config python3-pip python3-dev \
    libssl-dev libffi-dev libxml2-dev libxslt1-dev \
    zlib1g-dev libjpeg-dev libpq-dev \
    net-tools iputils-ping dnsutils traceroute whois netcat-traditional \
    tcpdump wireshark-common tshark nmap masscan hping3 \
    sqlite3 libsqlite3-dev \
    jq parallel procps htop tmux screen && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update

RUN apt-get update && apt-get install -y --no-install-recommends \
    kali-linux-large \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir --break-system-packages \
    requests beautifulsoup4 lxml scrapy selenium \
    scapy dnspython netaddr ipaddress \
    pwntools ropper ropgadget \
    volatility3 \
    python-magic pefile \
    keystone-engine capstone unicorn \
    httpx jwt \
    colorama termcolor tabulate

RUN wget -q https://go.dev/dl/go1.21.5.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz && \
    rm go1.21.5.linux-amd64.tar.gz

ENV PATH="/usr/local/go/bin:/root/go/bin:${PATH}" \
    GOPATH="/root/go"

RUN go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest && \
    go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest && \
    go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest && \
    go install -v github.com/projectdiscovery/katana/cmd/katana@latest && \
    go install -v github.com/projectdiscovery/naabu/v2/cmd/naabu@latest && \
    go install -v github.com/ffuf/ffuf/v2@latest && \
    go install -v github.com/tomnomnom/waybackurls@latest && \
    go install -v github.com/tomnomnom/gf@latest && \
    go install -v github.com/jaeles-project/gospider@latest && \
    go install -v github.com/lc/gau/v2/cmd/gau@latest && \
    go install -v github.com/hakluke/hakrawler@latest && \
    nuclei -update-templates

WORKDIR /opt/cortexai

COPY package*.json ./

RUN PUPPETEER_SKIP_DOWNLOAD=true npm ci --omit=dev && \
    npm cache clean --force

COPY agent.js ./
COPY lib/ ./lib/
COPY plugins/ ./plugins/
COPY documentation/ ./documentation/
COPY README.md LICENSE SECURITY.md CONTRIBUTING.md ./

RUN mkdir -p \
    /root/.cortexai/projects \
    /root/.cortexai/configs \
    /root/.cortexai/logs \
    /root/.cortexai/evidence \
    /opt/wordlists \
    /opt/payloads \
    /opt/reports \
    /opt/workspace && \
    ln -s /usr/share/wordlists /opt/wordlists/kali && \
    ln -s /usr/share/seclists /opt/wordlists/seclists || true

RUN echo '#!/bin/bash\ncd /opt/cortexai && node agent.js "$@"' > /usr/local/bin/cortexai && \
    chmod +x /usr/local/bin/cortexai && \
    cat > /opt/cortexai/.env.template <<'EOF'
# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=your_deployment_name_here
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Or use OpenAI directly
# OPENAI_API_KEY=your_openai_api_key_here

# CortexAI Configuration
CORTEX_ENABLE_FORMATTING=true
CORTEX_AUTO_PROJECT=false
CORTEX_DEBUG=false
CORTEX_MAX_HISTORY=100

# Proxy Configuration (optional)
# HTTP_PROXY=http://proxy:8080
# HTTPS_PROXY=http://proxy:8080
EOF

RUN cat >> /root/.bashrc <<'EOF'

export PS1='\[\033[01;31m\]┌──[\[\033[01;35m\]CortexOS\[\033[01;31m\]]─[\[\033[00;37m\]\w\[\033[01;31m\]]\n└──╼ \[\033[01;32m\]$\[\033[00m\] '

alias cortex='cortexai'
alias c='cortexai'
alias ll='ls -lah'
alias ports='netstat -tulanp'
alias myip='curl -s ifconfig.me'
alias scan='nmap -sV -sC'
alias dirb-common='dirb http://target /usr/share/wordlists/dirb/common.txt'
alias sqlmap-check='sqlmap -u'
alias metasploit='msfconsole -q'
alias burp='burpsuite &'
alias wireshark='wireshark &'

alias cortex-new='cortexai --new-project'
alias cortex-help='cortexai --help'

alias check-tools='echo "Checking installed tools..." && which nmap sqlmap nikto burpsuite metasploit hydra john hashcat wireshark tcpdump masscan gobuster ffuf nuclei'

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                         CortexOS v1.2.0                           ║"
echo "║              Penetration Testing Operating System                 ║"
echo "║                    Powered by CortexAI                            ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""
echo "Quick Start:"
echo "  cortexai          - Launch CortexAI agent"
echo "  cortex --help     - Show help and commands"
echo "  check-tools       - Verify installed security tools"
echo ""
echo "Documentation: /opt/cortexai/documentation/"
echo "Workspace: /opt/workspace/"
echo "Wordlists: /opt/wordlists/"
echo ""
EOF

# Create health check script
RUN cat > /usr/local/bin/healthcheck.sh <<'EOF'
#!/bin/bash
# CortexOS Health Check
echo "Performing CortexOS health check..."

if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found"
    exit 1
fi

if [ ! -d "/opt/cortexai/node_modules" ]; then
    echo "ERROR: Node modules not installed"
    exit 1
fi

tools=("nmap" "sqlmap" "nikto" "metasploit" "hydra" "john" "hashcat")
for tool in "${tools[@]}"; do
    if ! command -v $tool &> /dev/null; then
        echo "WARNING: $tool not found in PATH"
    fi
done

echo "Health check passed!"
exit 0
EOF

RUN chmod +x /usr/local/bin/healthcheck.sh

RUN cat > /entrypoint.sh <<'EOF'
#!/bin/bash
set -e

if [ ! -f /opt/cortexai/.env ] && [ -f /opt/cortexai/.env.template ]; then
    echo "No .env file found. Please configure your environment variables."
    echo "Copy .env.template to .env and update with your API keys."
fi

cat << 'BANNER'
╔═══════════════════════════════════════════════════════════════════╗
║   ____           _            ___  ____                           ║
║  / ___|___  _ __| |_ _____  _/ _ \/ ___|                          ║
║ | |   / _ \| '__| __/ _ \ \/ / | | \___ \                         ║
║ | |__| (_) | |  | ||  __/>  <| |_| |___) |                        ║
║  \____\___/|_|   \__\___/_/\_\\___/|____/                         ║
║                                                                   ║
║              Penetration Testing Operating System                ║
║                    Powered by CortexAI v1.2.0                    ║
╚═══════════════════════════════════════════════════════════════════╝

Container started successfully!
BANNER

# Execute the command
exec "$@"
EOF

RUN chmod +x /entrypoint.sh

# Set working directory to workspace
WORKDIR /opt/workspace

# Expose common ports for tools
EXPOSE 8080 8081 3000 4444 5555 8000 9090

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD /usr/local/bin/healthcheck.sh

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Default command
CMD ["/bin/bash"]
