<img align="left" width="300" height="300" alt="cortexai-logo" src="https://github.com/user-attachments/assets/bfa94ca1-4ca8-4f9d-b9f6-520ceac7d4b6" /> 
<div id="user-content-toc">
  <ul align="center" style="list-style: none;">
    <summary>
      <h1>CortexAI</h1><br>
      The First Truly Autonomous Penetration Testing Agent
    </summary>
  </ul>
</div>


*Self-reasoning. Self-explaining. Self-improving.*
An intelligent terminal agent powered by AI for ethical security testing and vulnerability analysis with integrated project management, scope tracking, and evidence collection. 

For detailed documentation, see [documentation](https://github.com/theelderemo/cortexai/tree/main/documentation)

<br>

[![Docs are updated](https://img.shields.io/badge/docs-updated-green?color=blue)](https://github.com/theelderemo/cortexai/tree/main/documentation)
![GitHub stars](https://img.shields.io/github/stars/theelderemo/cortexai?style=social)
![GitHub forks](https://img.shields.io/github/forks/theelderemo/cortexai?style=social)
![GitHub issues](https://img.shields.io/github/issues/theelderemo/cortexai)
![GitHub license](https://img.shields.io/github/license/theelderemo/cortexai)
![Node version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

</div>

> [!TIP]
> There is now an official [CortexAI Plugin Repo](https://github.com/theelderemo/cortexai-plugins) for a community first platform. Go check it out!  

## What is CortexAI?

CortexAI is **not another pentesting tool suite** 
It's an autonomous AI agent that conducts authorized security assessments the way a senior security consultant would: by reasoning about objectives, orchestrating the right tools, explaining its decisions, and continuously improving its approach.

Traditional tools like Burp Suite and OWASP ZAP require you to manually decide which scans to run, interpret results, and document findings. **CortexAI is different**:

```bash
You: "Run an initial security assessment on this web app"
```

CortexAI: 
 - ✓ Reasoning: Breaking down into content discovery, technology fingerprinting, and structure analysis
 -  ✓ Executing: discover_content, web_request, browse_website (3 tools orchestrated)
 -  ✓ Analyzing: Found CORS misconfiguration, missing security headers, exposed login form
 -  ✓ Logging: 3 medium-severity vulnerabilities stored to project database
 -  ✓ Recommending: Next steps include JavaScript analysis and XSS testing

**This is agentic AI**—autonomous planning, multi-tool orchestration, contextual reasoning, and transparent decision-making in a single platform.

## Why CortexAI?

### **Autonomous Agent, Not a Workflow**
- **Self-planning**: Give high-level objectives ("assess this target"), not step-by-step instructions
- **Dynamic tool selection**: Agent chooses the right tools based on mission context
- **Contextual memory**: Understands follow-up commands like "log that" by referencing its own previous output
- **Adaptive execution**: When tools fail, automatically switches strategies and continues the mission

### **Self-Explaining and Transparent**
- **Real-time audit logs**: Separate terminal window shows every action, tool call, and decision
- **Explains failures**: "Puppeteer failed due to ERR_BLOCKED_BY_CLIENT—here's why and here are 7 alternatives"
- **Justifies decisions**: Every action includes reasoning (why this tool, why this approach, why this severity rating)
- **Compliance-ready**: GDPR/NIST-compatible explainable AI for regulated industries

### **Self-Improving Infrastructure**
- **Recommends missing tools**: "I need Playwright for dynamic rendering—here's how to install it"
- **Dynamic capability expansion**: New tools automatically registered when installed
- **Ecosystem intelligence**: Knows 100+ security tools, their use cases, and when to apply them
- **Continuous learning**: Adapts strategies based on environmental feedback

### **Enterprise-Grade Project Management**
- **SQLite project databases**: Every engagement tracked with scope, findings, evidence, and audit trails
- **Immutable evidence collection**: Chain-of-custody for HTTP requests, responses, and discovered assets
- **OWASP/CWE classification**: Automatic mapping of findings to industry standards
- **Multi-engagement tracking**: Manage dozens of concurrent assessments with isolated contexts

### **Extensible Plugin Architecture**
- **26+ built-in tools** across 5 core plugins (web analysis, filesystem, command execution, encoding)
- **Community marketplace ready**: Third-party plugins load dynamically without touching core code
- **Tool abstraction layer**: Works with any CLI security tool already installed on your system
- **Open architecture**: Build custom plugins following our manifest standard

***

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Azure OpenAI API access (or configure alternative providers in roadmap)
- Authorized testing environment with written permission

### Installation

**Option 1: Local (Recommended)**
```bash
git clone https://github.com/theelderemo/cortexai.git
cd cortexai
npm install
cp .env.example .env
nano .env  # Add your Azure OpenAI credentials
npm start
```

Option 2: Docker
```bash
git clone https://github.com/theelderemo/cortexai.git
cd cortexai
docker build -t cortexai:latest .
docker run -it --rm -v $(pwd)/.env:/opt/cortexai/.env cortexai:latest
Configuration
```


**Option 3: CortexOS (custom Kali deviated OS)**
```bash
# Coming soon
```

### Configuration

Create a `.env` file with your AI provider credentials:

```env
AZURE_ENDPOINT=your-endpoint-here
AZURE_MODEL_NAME=gpt-4o
AZURE_DEPLOYMENT=your-deployment-name
AZURE_API_KEY=your-api-key
AZURE_API_VERSION=2024-12-01-preview

# Optional: Disable terminal formatting
AGENT_DISABLE_FORMATTING=false
```

***

## Example Usage

### Creating and Managing Projects
```bash
> "Create a new project for testing example.com with API and web scope"

CortexAI creates project, initializes database, sets scope rules automatically

> "Add https://example.com/* to scope but exclude /admin/*"

Scope manager updated, out-of-scope routes will be automatically skipped

> "Launch the database viewer"

Opens SQLite browser GUI for real-time project monitoring
```

### Autonomous Security Assessment
```bash
> "Perform comprehensive security testing on this target"

CortexAI autonomously:
  1. Discovers hidden content (admin panels, config files, backups)
  2. Fingerprints technologies (server versions, frameworks, libraries)
  3. Analyzes client-side behavior (JavaScript endpoints, form inputs)
  4. Tests for OWASP Top 10 (XSS, SQLi, CSRF, authentication flaws)
  5. Logs findings with severity ratings and remediation guidance
  6. Generates structured report with attack surface analysis
```

### Contextual Intelligence
```bash
> "Can you run an initial scan but don't use nmap"

Agent autonomously selects alternative reconnaissance tools

> "Log that"

Agent understands "that" refers to findings in previous output,
extracts all distinct vulnerabilities, and logs each with correct severity

> "Why did Puppeteer fail?"

Agent explains: ERR_BLOCKED_BY_CLIENT, fallback strategy used,
recommends 7 alternative tools (Playwright, Selenium, etc.) with installation commands
```

## Architecture

### Core Components
```
cortexai/
├── agent.js              # Main agentic reasoning loop (Azure OpenAI integration)
├── plugins/              # Extensible tool system
│   ├── web-plugin/       # HTTP requests, browsing, web search
│   ├── web-analysis-plugin/  # JavaScript analysis, API probing
│   ├── filesystem-plugin/    # File operations
│   ├── command-plugin/   # System command execution
│   └── example-plugin/   # Encoding/hashing utilities
├── lib/
│   ├── ProjectManager.js     # SQLite-based engagement tracking
│   ├── ScopeManager.js       # URL/domain scope rules
│   ├── IssueManager.js       # Vulnerability classification and storage
│   ├── PluginLoader.js       # Dynamic tool registration system
│   └── ToolRegistry.js       # Central tool orchestration
└── .cortexai/
    ├── projects/         # Per-engagement databases
    └── templates/        # Reporting templates
```

### Plugin System
Every plugin includes a `plugin.json` manifest:
```json
{
  "name": "custom-scanner",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "Custom vulnerability scanner",
  "tools": [
    {
      "name": "scan_custom_vuln",
      "description": "Detects custom vulnerability patterns",
      "parameters": { "url": "string", "depth": "integer" }
    }
  ]
}
```

Plugins auto-load at startup. The AI agent automatically discovers and uses new tools without configuration[1].

***

## Roadmap

### **Phase 1: Extensible Core** (Complete)
- [x] Dynamic plugin loader with manifest system
- [x] 26 core tools across 5 plugins
- [x] Project management with SQLite databases
- [x] Real-time audit logging
- [x] OWASP/CWE vulnerability classification

### **Phase 2: Cross-Platform Desktop GUI** (In Progress)
- [ ] Electron-based desktop app (Linux, Windows, macOS)
- [ ] Visual project manager and scope editor
- [ ] Integrated database viewer with charts
- [ ] Real-time agent monitoring dashboard
- [ ] Export reports (PDF, Markdown, JSON, HTML)

### **Phase 3: API-First Architecture**
- [ ] Node.js API server (Express/Fastify)
- [ ] PostgreSQL database for multi-user support
- [ ] RESTful API for all core functions
- [ ] AI provider abstraction (Azure, OpenAI, Anthropic, Ollama, Gemini)
- [ ] User authentication and API key management

### **Phase 4: Enterprise Features** (Proprietary)
- [ ] Intercepting HTTP/HTTPS proxy (Burp Suite equivalent)
- [ ] Request Repeater and Intruder UI
- [ ] Modular exploit framework with OWASP exploit modules
- [ ] Role-based access control (RBAC)
- [ ] Team collaboration with real-time sync
- [ ] Compliance dashboards (PCI DSS, HIPAA, SOC 2)

### **Phase 5: Autonomous Agent Evolution**
- [ ] Multi-step goal planning with ReAct prompting
- [ ] Attack path graph modeling (Neo4j integration)
- [ ] Ethical governor with mandatory approval checkpoints
- [ ] Autonomous exploitation with human-in-the-loop
- [ ] Self-correction and adaptive replanning

### **Phase 6: Ecosystem & SaaS**
- [ ] CortexAI Marketplace for third-party plugins
- [ ] Managed SaaS platform (multi-tenant cloud)
- [ ] Bug bounty platform integrations (HackerOne, Bugcrowd)
- [ ] Certification program (CCRTO: CortexAI Certified Red Team Operator)

***

## Comparison: CortexAI vs. Traditional Tools

| **Feature** | **Burp Suite Pro** | **OWASP ZAP** | **CortexAI** |
|-------------|-------------------|---------------|--------------|
| **Automation Type** | Manual workflows | Scripted scans | Autonomous agent |
| **Tool Selection** | User decides | User decides | AI orchestrates |
| **Reasoning Transparency** | ❌ No | ❌ No | ✅ Real-time logs |
| **Self-Explanation** | ❌ No | ❌ No | ✅ Explains decisions |
| **Infrastructure Recommendations** | ❌ No | ❌ No | ✅ Suggests tools |
| **Project Management** | External tools | External tools | ✅ Integrated SQLite |
| **Contextual Memory** | ❌ No | ❌ No | ✅ Multi-turn reasoning |
| **Extensibility** | BApp Store | Marketplace | ✅ Plugin system |
| **Pricing** | $449/year | Free | **Free (Community)** + Paid (Enterprise) |

**Key Differentiator**: CortexAI is the only tool where you give objectives, not instructions. It's an analyst, not a toolbox.

***

## Legal & Responsible Use

### **Authorization Required**

**ONLY use CortexAI against**:
- Systems you own or have explicit written permission to test
- Authorized penetration testing engagements with signed contracts
- Bug bounty programs within defined scope
- Internal security assessments on corporate infrastructure
- Controlled research environments (DVWA, HackTheBox, etc.)

**NEVER use CortexAI for**:
- Unauthorized scanning of third-party systems
- Testing without documented approval
- Illegal activities or malicious attacks

Unauthorized access to computer systems is **illegal** under CFAA (US), Computer Misuse Act (UK), and similar laws worldwide. Violators face criminal prosecution.

### **Data Security**

Project databases contain sensitive information:
- Credentials and API tokens discovered during testing
- Vulnerability details and exploitation techniques
- HTTP request/response evidence

**Follow proper security practices**:
- Encrypt project databases at rest
- Use secure channels for data transmission
- Follow responsible disclosure policies
- Implement data retention policies per engagement contracts

### **Responsible Disclosure**

Report discovered vulnerabilities through:
- Vendor security contacts (security@company.com)
- Bug bounty platforms (HackerOne, Bugcrowd, Intigriti)
- CERT coordination centers
- Coordinated disclosure timelines (90-day standard)

**Never publicly disclose** zero-day vulnerabilities without vendor notification and remediation time.

## Contributing

I welcome contributions from the security community! See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Plugin development guide
- Code standards and testing requirements
- Pull request process
- Community guidelines

**Quick Plugin Creation**:
```bash
# Use the plugin generator
npm run create-plugin -- --name my-scanner

# Automatically creates:
# plugins/my-scanner/
#   ├── plugin.json
#   ├── index.js
#   └── README.md
```

## Support & Sponsorship

### 💬 **Get Help**
- **Documentation**: [Full docs](./docs/)
- **Discord**: ***coming soon***
- **GitHub/Bug Issues**: [Report bugs](https://github.com/theelderemo/cortexai/issues)
- **Security Issues**: Email chris.dickinson@mailfence (not public issues). **Do NOT send code, exploits, vulnerabilities via email without making contact first to establish PGP key communication**

### ❤️ **Support Development**
CortexAI is **free forever** for individual pentesters. Support ongoing development:

- ☕ [Buy Me a Coffee](https://buymeacoffee.com/theelderemo)
- 💙 [Ko-fi](https://ko-fi.com/theelderemo)
- 🎁 [Thanks.dev](https://thanks.dev/theelderemo)
- 🇺🇸 [VetSec - Supporting Veteran Cybersecurity Professionals](https://vetsec.org)
- 🎖️ [Hire Heroes USA - Supporting Military Transitions](https://giving.hireheroesusa.org/give/154895/#!/donation/checkout)

## License

**Community Edition**: [MIT License](./LICENSE) - Free for individuals and small teams

**Enterprise Edition** (coming Phase 4): Proprietary license with:
- Intercepting proxy and advanced exploitation tools
- Team collaboration and RBAC
- Compliance dashboards and managed AI backend
- Priority support and SLA guarantees

> [!IMPORTANT]
> This software is licensed under the MIT License, which requires the inclusion of the original copyright notice in all substantial copies of the software. This is here for transparency. To aid in verifying license compliance, the source code contains various digital watermarks.

## Acknowledgments

Built with:
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service) - Agentic reasoning engine
- [Puppeteer](https://pptr.dev/) - Browser automation
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - Project database
- [Chalk](https://github.com/chalk/chalk) - Terminal formatting
- Open-source security community

Special thanks to contributors and the penetration testing community for feedback and testing.

***

<div align="center">

**⭐ Star this repo if CortexAI helps your security work**

**🔗 Share with your security team**

**🐛 Report bugs and request features**

**Made with ❤️ by [@theelderemo](https://github.com/theelderemo)**

*Empowering ethical hackers with autonomous AI*

</div>
