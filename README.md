# <img align="left" width="300" height="300" alt="cortexai-logo" src="https://github.com/user-attachments/assets/bfa94ca1-4ca8-4f9d-b9f6-520ceac7d4b6" /> 
<div id="user-content-toc">
  <ul align="center" style="list-style: none;">
    <summary>
      <h1>CortexAI</h1><br>
      Your Comprehensive Penetration Testing Platform
    </summary>
  </ul>
</div>


An intelligent terminal agent powered by AI for ethical security testing and vulnerability analysis with integrated project management, scope tracking, and evidence collection.

> For detailed documentation, see [documentation](https://github.com/theelderemo/cortexai/tree/main/documentation)

<br>


## Overview

CortexAI is an interactive terminal agent (not workflow, a truly autonomous agent) designed for security professionals conducting authorized penetration tests, vulnerability assessments, and security audits. It combines AI-guided security testing with comprehensive project management, scope tracking, and evidence collection in a single platform.

**Authorization Required**: Only use against systems you own or have explicit written permission to test. Unauthorized testing is illegal.

## Features

- **Project Management**: SQLite-based engagement tracking with scope management, site mapping, and vulnerability databases
- **Security Testing**: Web app security (OWASP Top 10), network reconnaissance, vulnerability scanning, and exploitation
- **Tool Integration**: Seamless integration with Nmap, Burp Suite, Metasploit, OWASP ZAP, and any CLI security tools. If the tool, software, etc is installed on your computer, the agent can access and use it.
- **Evidence Collection**: Automatic HTTP request/response capture and issue tracking with OWASP/CWE classification
- **Rich Terminal UX**: Color-coded output, severity highlighting, and formatted markdown rendering
- **Live Agent Audit Log**: Know exactly what the agent is doing, tools it is using, and files it is accessing via a log window.
- 
## Quick Start

### Option 1: Local Installation (Recommended)

```bash
git clone https://github.com/theelderemo/cortexai.git
cd cortexai
npm install
cp .env.example .env
nano .env  # Add your Azure OpenAI credentials
npm start
```

### Option 2: Docker

```bash
git clone https://github.com/theelderemo/cortexai.git
cd cortexai
docker build -t cortexai:latest .
docker run -it --rm -v $(pwd)/.env:/opt/cortexai/.env cortexai:latest
```

## Configuration

Create a `.env` file with your Azure OpenAI credentials:[2]

```
AZURE_ENDPOINT=your-endpoint
AZURE_MODEL_NAME=gpt-4o
AZURE_DEPLOYMENT=your-deployment
AZURE_API_KEY=your-key
AZURE_API_VERSION=2024-12-01-preview
```

**Optional**: Set `AGENT_DISABLE_FORMATTING=true` to disable terminal formatting.[1]

## Usage Example

```
> "Create a new project for testing example.com"
> "Add https://example.com/* to scope"
> "Exclude /admin/* from testing scope"
> "Perform a comprehensive security assessment"
> "Show me all critical vulnerabilities"
> "Launch the database viewer"
```

## Legal & Responsible Use

**Authorized Use Cases**:
- Systems you own or have explicit written permission to test
- Authorized penetration testing engagements
- Bug bounty programs within defined scope
- Internal security assessments
- Controlled research environments

**Prohibited**: Testing third-party systems without authorization, illegal activities, unauthorized scanning.[3][1]

**Data Handling**: Project databases contain sensitive information (credentials, tokens, vulnerabilities). Follow proper security and data retention policies.

**Responsible Disclosure**: Report discovered vulnerabilities through proper channels with coordinated disclosure.[1]

***This is a very, very brief and condensed readme, for a more in depth look, please check out the [Full Documentation](https://github.com/theelderemo/cortexai/tree/main/documentation)**
