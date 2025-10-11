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

Terminal Tool Integration — Run shell commands, inspect files, and interact with the host system from the agent.

AI-driven Analysis — The agent runs an AI assistant configured with security-focused prompts and methodologies (OWASP Top 10, CWE mapping, vulnerability triage).

Enhanced Terminal Formatting — Markdown → styled terminal output (headers, code blocks, severity coloring, file / IP highlighting).

Comprehensive Logging — Live log window and persistent log files for auditability and reporting.

Tooling Hooks — Built-in functions for execute_command, read_file, write_file, list_directory, and get_cwd.

Responsible Disclosure Workflow — Prompts and output structure emphasize verification, impact analysis, and remediation (not exploitation).

Configurable Behavior — Toggle formatting, set Azure/OpenAI model details, and control agent behavior via environment variables.

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

No Unauthorized Scanning. Do not target third-party systems without permission. Unauthorized scanning and exploitation can be illegal and damaging.

Impact Awareness. Some commands or scans may degrade or disrupt systems (high volume scans, destructive payloads, commands that modify configuration). The agent is intended to warn before destructive actions — heed those warnings.

Data Handling. Logs may contain sensitive information (tokens, credentials, PII, internal URLs). Treat log files securely and follow your organization’s data retention and handling policies.

Responsible Disclosure. If you discover vulnerabilities, follow a responsible disclosure workflow: document findings, verify impact, minimize disclosure details in public, and coordinate with the affected party.

Compliance. Ensure your activities comply with applicable laws, contracts, and organizational policies.

This README and the agent explicitly promote ethical, permissioned security work. Use responsibly.

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

Website Scanning
Ask the agent to perform a scan of example.com.

Inventory & Discovery 
Ask the agent to enumerate services, parse configuration files, and summarize likely exposure points.

Static File/Code Review
Have the agent read project files and provide a risk-graded review (credential leakage, insecure config flags, dependency issues).

Certificate and TLS Checks
Request checks of TLS configuration and certificate validity

Log Analysis
Point the agent at log files and ask for suspicious patterns, anomalous login attempts, or misconfigurations.

Report Generation
Ask the agent to create a templated vulnerability report containing findings, severity, impact, remediation steps, and references.

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
