# CortexAI Project Management System

## Overview

CortexAI now includes a comprehensive Project Management Engine that provides structured organization for penetration testing engagements. The system automatically handles project creation, scope management, vulnerability tracking, and evidence storage using SQLite databases for persistence.

## 🚀 Key Features

### Project Management Engine
- **Self-contained Projects**: Each project is stored in its own directory with SQLite database
- **Configuration Templates**: Save and reuse project configurations
- **Database Viewer Integration**: Automatic SQLite browser launching for real-time monitoring
- **Project Lifecycle**: Create, save, load, and close projects seamlessly

### Target Scoping & Site Mapping
- **Advanced Scope Definition**: Define in-scope and out-of-scope targets using:
  - URL patterns with wildcards (`https://example.com/*`)
  - Regular expressions for complex patterns
  - CIDR notation for IP ranges (`192.168.1.0/24`)
- **Hierarchical Site Map**: Automatic tree-view representation of discovered assets
- **Asset Discovery**: Both passive (from traffic) and active (crawling) discovery
- **Content Discovery**: Built-in dirb/gobuster-style hidden file/directory discovery

### Centralized Issue Management
- **Vulnerability Database**: Automatic logging of identified vulnerabilities with:
  - Title, description, severity, CWE ID, OWASP category
  - URL, parameter, payload, and evidence details
  - Status tracking (New, Confirmed, False Positive, Remediated, Risk Accepted)
- **Evidence Locker**: Automatic capture and storage of HTTP request/response pairs
- **Auto-Detection**: Built-in detection for common vulnerabilities:
  - SQL Injection (database error patterns)
  - Cross-Site Scripting (reflected input)
  - Information Disclosure (sensitive data exposure)
  - Missing Security Headers

## 🛠️ Available Tools

### Project Management
- `project_create` - Create new penetration testing projects
- `project_load` - Load existing projects
- `project_list` - List all available projects
- `project_status` - Show current project summary

### Scope Management
- `scope_add` - Add include/exclude rules for testing scope
- `scope_list` - View all scope rules for current project

### Site Mapping & Discovery
- `sitemap_view` - View hierarchical site map of discovered assets
- `discover_content` - Perform content discovery (dirb/gobuster style)

### Vulnerability Management
- `vuln_log` - Log new vulnerability findings
- `vuln_list` - List vulnerabilities with optional filtering
- `vuln_update` - Update vulnerability status
- `evidence_store` - Store HTTP evidence for vulnerabilities

### Database Management
- `database_viewer` - Launch SQLite browser for project database

## 📁 Project Structure

Each project creates the following structure:

```
~/.cortexai/
├── projects/
│   └── [project-name]/
│       ├── project.db          # SQLite database
│       └── config.json         # Project configuration
└── templates/
    └── default.json           # Default configuration template
```

## 🗄️ Database Schema

The SQLite database includes these tables:

- **sites**: Discovered web assets and their metadata
- **vulnerabilities**: All identified security issues
- **http_evidence**: HTTP request/response pairs for evidence
- **scope_rules**: Include/exclude rules for testing scope
- **scans**: Scan history and metadata
- **config_history**: Configuration change tracking

## 🎯 Usage Examples

### Starting a New Project

When you run `npm start`, CortexAI will prompt you to:
1. Create a new project or open existing one
2. Enter project name and target
3. Optionally use a configuration template
4. Set up initial scope rules

### Defining Scope

```bash
# Include primary target
scope_add --rule_type include --pattern_type url --pattern "https://example.com/*"

# Exclude admin areas
scope_add --rule_type exclude --pattern_type url --pattern "*/admin/*"

# Include IP range
scope_add --rule_type include --pattern_type cidr --pattern "192.168.1.0/24"

# Use regex for complex patterns
scope_add --rule_type include --pattern_type regex --pattern "https://.*.example.com/api/.*"
```

### Vulnerability Tracking

Vulnerabilities are automatically detected and logged during testing, but you can also manually log findings:

```bash
vuln_log --title "SQL Injection in login form" \
         --severity High \
         --cwe_id "CWE-89" \
         --owasp_category "A03:2021 – Injection" \
         --url "https://example.com/login" \
         --parameter "username" \
         --evidence "Database error: mysql_fetch_array() expects parameter 1"
```

### Content Discovery

```bash
# Discover hidden files/directories
discover_content --base_url "https://example.com"

# Use custom wordlist
discover_content --base_url "https://example.com" --wordlist ["admin", "backup", "config"]
```

## 🔍 Automatic Vulnerability Detection

CortexAI automatically detects common vulnerabilities during testing:

1. **SQL Injection**: Detects database error patterns in responses
2. **XSS**: Identifies reflected user input without proper encoding
3. **Information Disclosure**: Finds sensitive data patterns (passwords, API keys, etc.)
4. **Security Headers**: Checks for missing security headers

All detected vulnerabilities are automatically:
- Logged to the project database
- Classified by severity and OWASP category
- Linked with HTTP evidence
- Tagged with appropriate CWE IDs

## 🎨 Database Viewer Integration

CortexAI can automatically launch SQLite browser applications for real-time database monitoring:

- Supports: `sqlitebrowser`, `sqliteadmin`, `sqliteman`
- Install recommended viewer: `sudo apt-get install sqlitebrowser`
- Access via chat command: "Launch database viewer" or use `database_viewer` tool

## 📊 Project Reporting

View comprehensive project summaries:

```bash
project_status  # Shows overview of current project
vuln_list       # Lists all vulnerabilities
sitemap_view    # Shows discovered assets hierarchy
```

Filter vulnerabilities by severity or status:

```bash
vuln_list --severity Critical
vuln_list --status New
```

## 🔧 Configuration Templates

Save common project configurations as templates:

- Templates stored in `~/.cortexai/templates/`
- Default template includes common settings
- Customize scope, authentication, and scan policies
- Reuse across multiple projects

## 🚨 Security Considerations

- All project data is stored locally in SQLite databases
- Evidence includes full HTTP request/response data
- Treat project files as sensitive security data
- Regular backup of project directories recommended
- Consider encryption for highly sensitive engagements

## 🤝 Integration with Testing Workflow

The project management system integrates seamlessly with existing CortexAI capabilities:

1. **Passive Discovery**: Web requests automatically populate site map
2. **Active Scanning**: Discovered assets are automatically scoped and categorized
3. **Evidence Collection**: HTTP traffic is automatically captured for vulnerabilities
4. **Reporting**: Comprehensive reports can be generated from database
5. **Collaboration**: SQLite databases can be shared between team members

## 💡 Tips for Effective Use

1. **Start with Scope**: Always define your scope rules before beginning testing
2. **Use Templates**: Create templates for common engagement types
3. **Monitor Real-time**: Keep database viewer open during testing
4. **Regular Status Checks**: Use `project_status` to track progress
5. **Evidence First**: Store evidence immediately when you find vulnerabilities
6. **Organize by Domain**: The hierarchical site map helps organize large targets

This project management system transforms CortexAI from a simple testing tool into a comprehensive penetration testing platform that maintains context, tracks progress, and preserves evidence throughout your security engagements.