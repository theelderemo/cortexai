# <img align="left" width="300" height="300" alt="cortexai-logo" src="https://github.com/user-attachments/assets/bfa94ca1-4ca8-4f9d-b9f6-520ceac7d4b6" /> CortexAI




Your Comprehensive Penetration Testing Platform

An intelligent terminal agent powered by AI for ethical security testing and vulnerability analysis with integrated project management, scope tracking, and evidence collection.

> For detailed documentation, see [documentation](https://github.com/theelderemo/cortexai/tree/main/documentation)


# Table of Contents

To see pictures of it in action, go to [Pictures](#pictures)

[Overview](#overview)

[Key Features](#key-features)

[Terminal Formatting & UX](#terminal-formatting--ux)

[Security, Legal & Responsible Use](#security-legal--responsible-use)

[Quick Start](#quick-start)

[Configuration](#configuration)

[Commands & Capabilities](#commands--capabilities)

[Project Management Tools](#project-management-tools)

[Logging & Auditing](#logging--auditing)

[Example Workflows](#example-workflows)

[Limitations & Safety Controls](#limitations--safety-controls)


# Overview

CortexAI is an interactive, terminal-first AI agent designed to assist penetration testers, security engineers, and auditors with reconnaissance, analysis, and reporting workflows. It integrates terminal command execution, file operations, structured AI guidance, and comprehensive project management into a single platform that runs locally.

This agent is explicitly built for ethical, white-hat security engagements.

# Key Features

## Core Capabilities

### Project Management Engine

  - **Self-contained Projects**: SQLite databases for each engagement.
  - **Scope Management**: Define in-scope and out-of-scope targets with URLs, regex, and CIDR.
  - **Hierarchical Site Mapping**: Automatic asset discovery and organization.
  - **Vulnerability Tracking**: Comprehensive issue management with evidence storage.
  - **Database Viewer Integration**: Real-time monitoring with SQLite browsers.
  - **Configuration Templates**: Save and reuse project setups.

### Penetration Testing & Security Assessment

  - **Web Application Security**: OWASP Top 10 testing, SQL injection, XSS, CSRF analysis.
  - **Network Reconnaissance**: Port scanning, service enumeration, network mapping.
  - **Vulnerability Scanning**: Automated and manual vulnerability assessment.
  - **System Exploitation**: Ethical exploitation techniques and proof-of-concept development.
  - **Security Tool Integration**: Seamless integration with Nmap, Burp Suite, Metasploit, OWASP ZAP, and more. If it's on your computer, it can use it.

### System & Infrastructure Analysis

  - **Local System Scanning**: File system analysis, privilege escalation vectors, system hardening assessment.
  - **Network Discovery**: Local network mapping, device enumeration, service discovery.
  - **Configuration Analysis**: Security configuration review, compliance checking.
  - **Log Analysis**: Security event correlation, anomaly detection, forensic analysis.
  - **Container Security**: Docker/Kubernetes security assessment and analysis.

### Advanced Web Security Testing

  - **API Security Testing**: REST/GraphQL API vulnerability assessment.
  - **Authentication Bypass**: Session management testing, authentication flow analysis.
  - **Authorization Testing**: Access control verification, privilege escalation testing.
  - **Input Validation**: Comprehensive input sanitization and validation testing.
  - **Business Logic Flaws**: Complex workflow and business rule vulnerability identification.

### Tool Arsenal Integration

  - **Configurable Behavior**: Toggle formatting, set Azure/OpenAI model details, and control agent behavior via environment variables.
  - **Command Line Tools**: Execute any security tool available on your system.
  - **Custom Scripts**: Run Python, Bash, or PowerShell security scripts.
  - **Security Frameworks**: Integration with popular security testing frameworks.
  - **Reporting Tools**: Automated report generation and vulnerability documentation.
  - **CI/CD Security**: DevSecOps integration and pipeline security testing.

## Startup Flow

When you launch CortexAI, you will be prompted to:

1.  **Create a new project** or **open an existing one**.
2.  Enter project details (name, target, description).
3.  Choose configuration templates (or skip).
4.  Set up initial scope rules.
5.  Launch the database viewer for real-time monitoring.

## Key Components

### Project Files

  - **SQLite Database**: Self-contained storage for all engagement data.
  - **Configuration**: JSON-based project settings and templates.
  - **Evidence Storage**: Automatic HTTP request/response capture.
  - **Scope Tracking**: Include/exclude rules with pattern matching.

### Target Scoping & Site Mapping

  - **Advanced Scope Definition**: URLs, regex patterns, CIDR notation.
  - **Hierarchical Site Map**: Tree-view of discovered assets.
  - **Asset Discovery**: Passive (traffic) and active (crawling) discovery.
  - **Content Discovery**: Built-in dirb/gobuster functionality.

### Centralized Issue Management

  - **Vulnerability Database**: Auto-logging with OWASP/CWE classification.
  - **Issue Tracking**: Status management (New, Confirmed, False Positive, etc.).
  - **Evidence Locker**: HTTP request/response storage for each finding.
  - **Auto-Detection**: Built-in detection for common vulnerabilities.

For complete documentation, see [Documentation](https://github.com/theelderemo/cortexai/tree/main/documentation).

# Terminal Formatting & UX

The agent converts markdown into rich terminal output for readability and faster triage. Formatting highlights include:

  - Color-coded headers and severity levels (Critical/High/Medium/Low).
  - Boxed code blocks with line markers and inline code highlighting.
  - Styled bullets and numbered lists for step-by-step guidance.
  - Special highlighting for file paths, IP addresses, and ports.

If you need or want raw markdown output, you can disable formatting (see [configuration](#configuration)).

# Security, Legal & Responsible Use

Read this before using the agent.

**Authorization Required**. Only run this software against systems and networks you own or against which you have explicit, documented authorization (signed scope of work, bug bounty program approval, or written permission).

### Authorized Use Cases

  - Testing systems you own or have explicit permission to test.
  - Authorized penetration testing engagements.
  - Security research in controlled environments.
  - Educational and training purposes.
  - Bug bounty programs with proper scope.
  - Internal security assessments.

**Do not target third-party systems without permission. Unauthorized scanning and exploitation can be illegal and damaging.**

**Impact Awareness**. Some commands or scans may degrade or disrupt systems (high volume scans, destructive payloads, commands that modify configuration). The agent is intended to warn before destructive actions—heed those warnings.

**Data Handling**. Logs and project databases may contain sensitive information (tokens, credentials, PII, internal URLs). Treat project files securely and follow your organization’s data retention and handling policies.

**Responsible Disclosure**. If you discover vulnerabilities, follow a responsible disclosure workflow: document findings, verify impact, minimize disclosure details in public, and coordinate with the affected party.

**Compliance**. Ensure your activities comply with applicable laws, contracts, and organizational policies.

This README explicitly promotes ethical, permissioned security work. Use responsibly.

# Quick Start

## Installation Options
You have two primary ways to get CortexAI up and running.

### Option 1: Clone and Run Locally (Recommended for Development)
This method gives you direct access to the source code, which is ideal for customization and development, and honestly the most secure way.

Clone the repository
~~~Bash
git clone https://github.com/theelderemo/cortexai.git
cd cortexai
~~~

Install Node.js dependencies
~~~Bash
npm install
~~~

Configure your environment
~~~Bash
cp .env.example .env
nano .env # Add your Azure OpenAI keys
~~~

Start the agent
~~~Bash
npm start
~~~

### Option 2: Build Docker Image from Source
Build your own Docker image to create a portable, self-contained environment with all dependencies and tools included. This is great for ensuring consistency across different machines.

Clone the repository
~~~Bash
git clone https://github.com/theelderemo/cortexai.git
cd cortexai
~~~

Build the Docker image (this may take a while!)
~~~Bash
sudo docker build -t cortexai:latest .
~~~

Run the container
Note: You must pass your .env file for API keys
~~~Bash
docker run -it --rm -v $(pwd)/.env:/opt/cortexai/.env cortexai:latest
~~~

CortexAI will prompt you to create or open a project before starting the main interface. This ensures all your testing is properly organized and tracked.

In the interactive prompt, type natural language security questions (e.g., “Perform a service discovery on this host,” or "Scan example.com for vulnerabilities"). Use `exit` or `quit` to end the session.

# Configuration

Copy `.env.example` to `.env` and populate the required variables:

```bash
cp .env.example .env
# then edit .env
```

**Required**

  - **AZURE\_ENDPOINT**: Your Azure OpenAI endpoint.
  - **AZURE\_MODEL\_NAME**: The model name (e.g., `gpt-4o`).
  - **AZURE\_DEPLOYMENT**: Your deployment identifier.
  - **AZURE\_API\_KEY**: The API key for Azure OpenAI.
  - **AZURE\_API\_VERSION**: The API version (e.g., `2024-12-01-preview`).

**Optional**

  - **AGENT_DISABLE_FORMATTING=true**: Disable enhanced terminal formatting and show raw markdown.

The agent performs environment validation at startup and will refuse to run if required variables are missing.

# Commands & Capabilities

From the interactive prompt, the agent can:

  - Execute shell commands (via `execute_command`).
  - Read files (`read_file`) and show file metadata.
  - Write files (`write_file`)—used for saving reports or proof-of-concept artifacts.
  - List directory contents (`list_directory`).
  - Get the current working directory (`get_cwd`).
  - Full project management capabilities (see below).

These are exposed as structured tool calls inside the agent to help the AI reason about and log actions. The agent also logs each tool call and result for auditability in a seperate pop up window that launches when you launch the agent. If you can do it via the command line, so can the agent.

# Project Management Tools

CortexAI includes comprehensive project management tools accessible via natural language commands:

### Project Operations

  - **Create projects**: "Create a new project for testing example.com"
  - **Load projects**: "Load my previous project" or "Open project ABC-test"
  - **List projects**: "Show me all my projects"
  - **Project status**: "What's the status of my current project?"

### Scope Management

  - **Add scope**: "Add https://example.com to scope"
  - **Exclude areas**: "Exclude /admin* from testing scope"
  - **CIDR ranges**: "Include 192.168.1.0/24 in scope"
  - **List scope**: "Show me the current scope rules"

### Site Discovery

  - **View site map**: "Show me the site map" or "What assets have been discovered?"
  - **Content discovery**: "Discover hidden files on example.com"
  - **Asset tracking**: Automatic population during testing.

### Vulnerability Management

  - **Log vulnerabilities**: "Log a SQL injection vulnerability I found"
  - **List findings**: "Show me all critical vulnerabilities"
  - **Update status**: "Mark vulnerability #5 as confirmed"
  - **Store evidence**: Automatic HTTP evidence capture.

### Database Access

  - **Launch viewer**: "Open the database viewer"
  - **Project monitoring**: Real-time database browser integration.

# Logging & Auditing

Logs are written to a persistent log file (by default in the OS temp directory). The agent attempts to open a separate terminal window running `tail -f` on the log file for live monitoring.

Each action—user input, tool calls, tool outputs, errors—is logged with timestamps and categories.

Project databases provide comprehensive audit trails with:

  - All discovered assets and their metadata.
  - Complete vulnerability tracking with evidence.
  - Scope rule history and changes.
  - HTTP request/response preservation.

Always secure logs and project files after an engagement, as they may contain sensitive outputs.

# Example Workflows

### Project-based Web Application Security Testing

```bash
> "Create a new project for testing example.com"
> "Add https://example.com/* to the testing scope"
> "Exclude /logout and /admin/delete/* from scope"
> "Plan out steps for finding bugs"
> "Perform a comprehensive security assessment of the target"
> "Show me all discovered vulnerabilities"
> "Launch the database viewer to review findings"
```

### Network Security Assessment with Project Tracking

```bash
> "Create a project for internal network assessment"
> "Add 192.168.1.0/24 to scope"
> "Map the local network and identify all active hosts"
> "Scan for vulnerable services and log any findings"
> "Show me the current project status"
```

### Organized System Security Analysis

```bash
> "Open my Linux-audit project"
> "Audit the system for security misconfigurations"
> "Check for SUID binaries and log any issues"
> "Update the status of previously found vulnerabilities"
> "Generate a project summary"
```

### Content Discovery and Asset Management

```bash
> "Load project WebApp-XYZ"
> "Discover hidden files and directories on the target"
> "Show me the hierarchical site map"
> "What new assets were discovered today?"
```

# Limitations & Safety Controls

  - **No automatic destructive actions**: The agent is designed to avoid destructive defaults and will warn before running potentially harmful commands, requiring confirmation.
  - **Model outputs must be verified**: AI is an assistant always validate findings manually before acting or reporting.
  - **Local privileges matter**: The agent runs with the privileges of the user who starts it. It cannot bypass OS security boundaries. Be wary of running it as `sudo`.
  - **Network scope is governed by you**: The agent does not automatically enumerate external networks or targets unless explicitly commanded within a permitted scope.
  - Project scope enforcement helps prevent accidental out-of-scope testing.

# Pictures

<img width="1293" height="872" alt="databasescreenshot" src="https://github.com/user-attachments/assets/9fccdaef-c7c2-4cf2-b106-d28ddcb6b31b" />
<img width="1059" height="656" alt="auditlog" src="https://github.com/user-attachments/assets/887fc77c-0df4-41b4-b0f3-8e3f59dc84eb" />
<img width="1920" height="1036" alt="term1" src="https://github.com/user-attachments/assets/42727129-3c56-4342-a8b5-c6bdfa78eb91" />
<img width="1920" height="1036" alt="term2" src="https://github.com/user-attachments/assets/71ec0be3-0d43-4faa-8028-3cc5be7533a0" />
<img width="1920" height="1036" alt="term3" src="https://github.com/user-attachments/assets/2fd18905-c6a9-482c-bb77-766652518364" />
<img width="1920" height="1036" alt="term4" src="https://github.com/user-attachments/assets/b2040321-b52c-41b7-8821-b281a917e9a6" />
