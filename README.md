# CortexAI

## Your Penetration Testing Terminal Agent
An intelligent terminal agent powered by AI for ethical security testing and vulnerability analysis.

> [!NOTE]
> This README describes an interactive security agent implementation (see agent.js). The README emphasizes responsible, permissioned use only. 

# Table of Contents

[Overview](#overview)

[Key Features](#key-features)

[Terminal Formatting & UX](#terminal-formatting--ux)

[Security, Legal & Responsible Use](#security-legal--responsible-use)

[Quick Start](#quick-start)

[Configuration](#configuration)

[Commands & Capabilities](#commands--capabilities)

[Logging & Auditing](#logging--auditing)

[Example Workflows](#example-workflows)

[Limitations & Safety Controls](#limitations--safety-controls)

[Contributing](#contributing)

[License](#license)

# Overview

CortexAI is an interactive, terminal-first AI agent designed to assist penetration testers, security engineers, and auditors with reconnaissance, analysis, and reporting workflows. It integrates terminal command execution, file operations, and structured AI guidance into a single agent that runs locally. The implementation this README references is available in agent.js. 

This agent is explicitly built for ethical / white-hat security engagements — with features and guardrails to encourage safe, permissioned testing.

# Key Features

## Core Capabilities

Most basic explanation: Terminal Tool Integration — Run shell commands, inspect files, and interact with the host system from the agent.

### Penetration Testing & Security Assessment
- **Web Application Security**: OWASP Top 10 testing, SQL injection, XSS, CSRF analysis
- **Network Reconnaissance**: Port scanning, service enumeration, network mapping
- **Vulnerability Scanning**: Automated and manual vulnerability assessment
- **System Exploitation**: Ethical exploitation techniques and proof-of-concept development
- **Security Tool Integration**: Seamless integration with Nmap, Burp Suite, Metasploit, OWASP ZAP, and more

### System & Infrastructure Analysis
- **Local System Scanning**: File system analysis, privilege escalation vectors, system hardening assessment
- **Network Discovery**: Local network mapping, device enumeration, service discovery
- **Configuration Analysis**: Security configuration review, compliance checking
- **Log Analysis**: Security event correlation, anomaly detection, forensic analysis
- **Container Security**: Docker/Kubernetes security assessment and analysis

### Advanced Web Security Testing
- **API Security Testing**: REST/GraphQL API vulnerability assessment
- **Authentication Bypass**: Session management testing, authentication flow analysis
- **Authorization Testing**: Access control verification, privilege escalation testing
- **Input Validation**: Comprehensive input sanitization and validation testing
- **Business Logic Flaws**: Complex workflow and business rule vulnerability identification

### Tool Arsenal Integration
- **Configurable Behavior**: Toggle formatting, set Azure/OpenAI model details, and control agent behavior via environment variables.
- **Command Line Tools**: Execute any security tool available on your system
- **Custom Scripts**: Run Python, Bash, PowerShell security scripts
- **Security Frameworks**: Integration with popular security testing frameworks
- **Reporting Tools**: Automated report generation and vulnerability documentation
- **CI/CD Security**: DevSecOps integration and pipeline security testing

# Terminal Formatting & UX

The agent converts markdown into rich terminal output for readability and faster triage. Formatting highlights include:

Color-coded headers and severity levels (Critical/High/Medium/Low).

Boxed code blocks with line markers and inline code highlighting.

Styled bullets (●) and numbered lists for step-by-step guidance.

Special highlighting for file paths, IP addresses, and ports.

If you need or want raw markdown output, you can disable formatting (see [configuration](#configuration)).

# Security, Legal & Responsible Use

Read this before using the agent.

Authorization Required. Only run this software against systems and networks you own or against which you have explicit, documented authorization (signed scope of work, bug bounty program approval, or written permission).

### Authorized Use Cases
- Testing systems you own or have explicit permission to test
- Authorized penetration testing engagements
- Security research in controlled environments
- Educational and training purposes
- Bug bounty programs with proper scope
- Internal security assessments

**Do not target third-party systems without permission. Unauthorized scanning and exploitation can be illegal and damaging**

Impact Awareness. Some commands or scans may degrade or disrupt systems (high volume scans, destructive payloads, commands that modify configuration). The agent is intended to warn before destructive actions — heed those warnings.

Data Handling. Logs may contain sensitive information (tokens, credentials, PII, internal URLs). Treat log files securely and follow your organization’s data retention and handling policies.

Responsible Disclosure. If you discover vulnerabilities, follow a responsible disclosure workflow: document findings, verify impact, minimize disclosure details in public, and coordinate with the affected party.

Compliance. Ensure your activities comply with applicable laws, contracts, and organizational policies.

This README explicitly promotes ethical, permissioned security work. Use responsibly.

# Quick Start

Clone the repo and install dependencies:
```bash
npm install
```

Copy environment template:

```bash
cp .env.example .env
```
Edit .env with your values (see Configuration below)

Start the agent:
```bash
npm start
```

In the interactive prompt, type natural language security questions (e.g., “Perform a service discovery on this host,” "Scan example.com for vulnerabilities). Use exit or quit to end the session.

# Configuration

Copy .env.example → .env and populate the required variables:
```bash
cp .env.example .env
# then edit .env
```

**Required**

AZURE_ENDPOINT — Azure OpenAI endpoint.

AZURE_MODEL_NAME — Model name (example: gpt-4o).

AZURE_DEPLOYMENT — Deployment identifier.

AZURE_API_KEY — API key for Azure OpenAI.

AZURE_API_VERSION — API version (e.g., 2024-12-01-preview).

Optional:

AGENT_DISABLE_FORMATTING=true — Disable enhanced terminal formatting and show raw markdown.

(Other environment variables may be used by your local environment or CI.)

The agent performs environment validation at startup and will refuse to run if required variables are missing. 

# Commands & Capabilities

From the interactive prompt, the agent can:

Execute shell commands (via execute_command).

Read files (read_file) and show file metadata.

Write files (write_file) — used for saving reports or proof-of-concept artifacts.

List directory contents (list_directory).

Get the current working directory (get_cwd).

These are exposed as structured tool calls inside the agent to help the AI reason about and log actions. The agent also logs each tool call and result for auditability. 

In other words, if you can do it normally via cli, so can the agent.

# Logging & Auditing

Logs are written to a persistent log file (by default in the OS temp directory).

The agent attempts to open a separate terminal window running tail -f on the log file for live monitoring.

Each action — user input, tool calls, tool outputs, errors — is logged with timestamps and categories.

Always secure logs after an engagement — they may contain sensitive outputs.

# Example Workflows

### Web Application Security Testing
```bash
> "Perform a comprehensive security assessment of https://example.com"
> "Test this login form for SQL injection and XSS vulnerabilities"
> "Analyze the session management implementation"
```

### Network Security Assessment
```bash
> "Map my local network and identify all active hosts"
> "Scan 192.168.1.0/24 for vulnerable services"
> "Check for default credentials on discovered services"
```

### System Security Analysis
```bash
> "Audit my Linux system for security misconfigurations"
> "Check for SUID binaries that could be exploited"
> "Analyze running processes for suspicious activity"
```

### Compliance & Hardening
```bash
> "Generate a CIS benchmark compliance report"
> "Review my Docker containers for security best practices"
> "Assess my system against NIST cybersecurity framework"
```
As well as:
- Log Analysis
- Report Generation
- Whatever else you can think of, within reason.

The agent will warn before running any command that it detects as potentially destructive. It is configured to require confirmation for high-impact operations. 

# Limitations & Safety Controls

No automatic destructive actions. The agent is designed to avoid destructive defaults; it will warn for destructive commands.

Model outputs must be verified. AI is an assistant — always validate findings manually before acting or reporting.

Local privileges matter. The agent runs with the privileges of the user who starts it. It cannot bypass OS security boundaries. Be wary of running it as sudo.

Network scope is governed by you. The agent does not **(and should not)** automatically enumerate external networks or targets unless explicitly commanded within a permitted scope.

# Contributing

Contributions are welcome for:

Improving formatting and terminal UX.

Adding safe scanners, parsers, or modules.

Hardening logging (redaction, encryption) and permission controls.

Enhancing the prompts and analysis methodology for better triage.

When contributing, ensure any added capabilities preserve ethical guardrails and include tests demonstrating non-destructive behavior.

# License

See License

Acknowledgements & Implementation Notes

This README reflects the agent implementation present in agent.js (tool definitions, logging, formatting, and interactive loop). For implementation details, see the source file. 
