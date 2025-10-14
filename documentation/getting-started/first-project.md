# First Project Guide

Learn how to create and manage your first penetration testing project with CortexAI.

## Overview

This guide walks you through creating your first project, understanding the project structure, defining scope, and performing basic security testing.

## Before You Start

### Prerequisites

- CortexAI installed and configured
- Azure OpenAI credentials set up
- Basic understanding of penetration testing concepts
- Authorization to test your target systems

### Important Legal Note

Before creating any project, ensure you have explicit authorization to test the target systems. CortexAI is designed for ethical, authorized penetration testing only.

## Project Creation Process

### Step 1: Launch CortexAI

```bash
cd cortexai
npm start
```

You'll see the Project Management System menu:

```
Project Management System
========================

[1] Create new project
[2] Open existing project
[3] List all projects

Choose an option (1-3):
```

### Step 2: Create New Project

Select option `1` to create a new project.

#### Project Name

Enter a descriptive name for your project:

```
Enter project name: My-First-Webapp-Test
```

**Naming Guidelines**:
- Use descriptive names
- Include target identifier
- Avoid spaces (use hyphens or underscores)
- Keep it concise but meaningful

**Examples**:
- `CompanyName-WebApp-Assessment`
- `BugBounty-ExampleCom`
- `Internal-Network-Audit-2024`

#### Target Definition

Specify the primary target:

```
Enter target: webapp.example.com
```

**Target Examples**:
- Domain: `example.com`
- Subdomain: `app.example.com`
- IP Address: `192.168.1.100`
- Network: `10.0.0.0/24`

#### Project Description

Provide a brief description:

```
Enter description: Security assessment of company web application
```

**Description Best Practices**:
- Include assessment type
- Note authorization details
- Mention engagement timeline
- Add any special considerations

### Step 3: Configure Initial Scope

After project creation, you'll be prompted to define the testing scope.

#### Adding In-Scope Items

```
Add to scope: https://webapp.example.com/*
```

**Common Scope Patterns**:
- Full domain: `https://example.com/*`
- Specific path: `https://example.com/app/*`
- Multiple subdomains: `https://*.example.com/*`
- API endpoints: `https://api.example.com/v1/*`
- Network range: `192.168.1.0/24`

#### Excluding Out-of-Scope Items

```
Exclude from scope: https://webapp.example.com/admin/production/*
```

**Common Exclusions**:
- Production admin panels
- Payment processing endpoints
- Third-party integrations
- User data deletion endpoints

### Step 4: Database Viewer Setup

When prompted, choose whether to launch the database viewer:

```
Launch database viewer? (Yes/No): Yes
```

**Database Viewer Benefits**:
- Real-time monitoring of discoveries
- View vulnerabilities as they're found
- Track evidence collection
- Monitor project statistics
- Query project data directly

The database viewer will open in your default browser, showing:
- Project overview
- Asset inventory
- Vulnerability list
- Evidence storage
- Scope definitions

### Step 5: Project Launch

CortexAI will now load your project and present the interactive interface:

```
✅ Project loaded: My-First-Webapp-Test
📊 Target: webapp.example.com
🎯 Scope: 1 include rule(s), 1 exclude rule(s)

Ready for testing. Type your commands or questions.

>
```

## Understanding Your Project

### Project Structure

Each project is stored as an SQLite database in the `projects/` directory:

```
projects/
└── My-First-Webapp-Test.db
```

The database contains:
- Project metadata and configuration
- Scope definitions (include/exclude rules)
- Discovered assets and site map
- Vulnerability findings
- HTTP request/response evidence
- Testing logs and history

### Project Files Location

```bash
# View all projects
ls -la projects/

# Check project size
du -h projects/My-First-Webapp-Test.db
```

## Basic Testing Workflow

### Initial Reconnaissance

Start with passive reconnaissance:

```
> "Show me the current project status"
```

```
> "What information do we have about the target?"
```

```
> "Perform passive reconnaissance on webapp.example.com"
```

### Active Discovery

Proceed to active discovery when ready:

```
> "Discover web server technology and configuration"
```

```
> "Map the site structure and find common paths"
```

```
> "Enumerate subdomains of example.com"
```

### Vulnerability Assessment

Begin security testing:

```
> "Check for common web vulnerabilities"
```

```
> "Test for SQL injection in user input fields"
```

```
> "Analyze security headers and configurations"
```

### Evidence Review

Review findings during and after testing:

```
> "Show me all discovered vulnerabilities"
```

```
> "List all assets discovered so far"
```

```
> "Display evidence for the SQL injection finding"
```

## Working with Scope

### Viewing Current Scope

```
> "Show me the current testing scope"
```

### Adding to Scope

```
> "Add https://api.example.com/* to scope"
```

```
> "Include the IP range 192.168.1.100-192.168.1.150 in scope"
```

### Removing from Scope

```
> "Remove https://staging.example.com from scope"
```

### Modifying Exclusions

```
> "Exclude /user/delete/* from testing"
```

```
> "Add /logout to the exclusion list"
```

## Managing Discoveries

### Viewing Assets

```
> "List all discovered web pages"
```

```
> "Show me the site map"
```

```
> "Display all API endpoints found"
```

### Reviewing Vulnerabilities

```
> "Show vulnerabilities by severity"
```

```
> "List all high-risk findings"
```

```
> "Display details for vulnerability ID 5"
```

### Evidence Collection

CortexAI automatically collects evidence for findings:
- HTTP requests and responses
- Command outputs
- Screenshots (when applicable)
- Tool outputs

View evidence in the database viewer or query directly:

```
> "Show evidence for the XSS vulnerability"
```

## Database Viewer Features

### Accessing the Viewer

The database viewer runs in your web browser and provides:

**Overview Dashboard**:
- Project statistics
- Recent activities
- Vulnerability summary
- Testing progress

**Asset Explorer**:
- Hierarchical site map
- Asset details and metadata
- Discovery timestamps
- Related vulnerabilities

**Vulnerability Tracker**:
- All findings with severity
- OWASP classifications
- Evidence links
- Remediation guidance

**Evidence Browser**:
- HTTP request/response pairs
- Command outputs
- Tool results
- Associated vulnerabilities

**Scope Manager**:
- Include rules
- Exclude rules
- Pattern testing
- Scope validation

### Database Queries

Advanced users can query the database directly using SQL:

```sql
-- View all high severity vulnerabilities
SELECT * FROM vulnerabilities WHERE severity = 'High';

-- List discovered assets
SELECT url, discovered_at FROM assets ORDER BY discovered_at DESC;

-- Count vulnerabilities by type
SELECT vulnerability_type, COUNT(*) FROM vulnerabilities GROUP BY vulnerability_type;
```

## Common First Project Tasks

### Web Application Testing

1. **Technology Detection**:
   ```
   > "Identify the web technologies used by the target"
   ```

2. **Directory Discovery**:
   ```
   > "Find common directories and files on the web server"
   ```

3. **Input Testing**:
   ```
   > "Test all user input fields for injection vulnerabilities"
   ```

4. **Security Headers**:
   ```
   > "Analyze HTTP security headers"
   ```

### Network Testing

1. **Port Scanning**:
   ```
   > "Scan common ports on 192.168.1.100"
   ```

2. **Service Enumeration**:
   ```
   > "Identify services running on discovered ports"
   ```

3. **Network Mapping**:
   ```
   > "Map the network topology"
   ```

### Documentation

1. **Generate Report**:
   ```
   > "Create a summary report of all findings"
   ```

2. **Export Data**:
   ```
   > "Export vulnerability data to JSON"
   ```

## Saving and Closing Projects

### Saving Progress

CortexAI automatically saves all data to the project database in real-time. No manual save is required.

### Closing a Project

To close the current project:

1. Type `exit` or press `Ctrl+C`
2. Confirm closure
3. Project data is preserved in the database

### Reopening a Project

To continue work on an existing project:

1. Run `npm start`
2. Select option `2` - Open existing project
3. Choose your project from the list
4. Work continues where you left off

## Project Best Practices

### Organization

- **One project per engagement**: Keep assessments separate
- **Descriptive naming**: Use clear, meaningful project names
- **Regular exports**: Backup important project data
- **Clean scope**: Define clear boundaries from the start

### Testing Approach

- **Start passive**: Begin with non-intrusive reconnaissance
- **Escalate gradually**: Increase testing intensity progressively
- **Document continuously**: Let CortexAI track everything
- **Verify findings**: Confirm vulnerabilities before reporting

### Safety

- **Scope validation**: Always verify targets are in scope
- **Rate limiting**: Avoid aggressive testing that might cause service issues
- **Authorization checks**: Regularly confirm you have permission
- **Impact awareness**: Monitor for unintended effects

## Troubleshooting

### Project Won't Create

**Issue**: Error during project creation

**Solutions**:
- Check disk space: `df -h`
- Verify write permissions: `ls -la projects/`
- Ensure project name is valid (no special characters)

### Database Viewer Won't Open

**Issue**: Database viewer fails to launch

**Solutions**:
- Check if port is already in use
- Verify browser is installed
- Try opening manually: `http://localhost:PORT`

### Scope Rules Not Working

**Issue**: Scope enforcement not behaving as expected

**Solutions**:
- Review pattern syntax
- Check for conflicting rules
- Test patterns: `> "Test if https://example.com/path is in scope"`

### Performance Issues

**Issue**: Project becomes slow with large datasets

**Solutions**:
- Archive old findings
- Limit evidence storage depth
- Split into multiple projects

## Next Steps

Now that you've created your first project:

1. **Learn Project Management**: [Project Management Overview](../project-management/overview.md)
2. **Explore Testing Techniques**: [Security Testing Guides](../security-testing/web-application.md)
3. **Try Common Workflows**: [Common Workflows](../user-guide/common-workflows.md)
4. **Review Best Practices**: [Best Practices](../user-guide/best-practices.md)

## Example Project Scenarios

### Bug Bounty Program

```
Project Name: BugBounty-ExampleCorp-Q1-2024
Target: example.com
Description: Bug bounty assessment following program guidelines
Scope: https://*.example.com/* (excluding payment.example.com)
```

### Internal Assessment

```
Project Name: Internal-WebApp-Audit-2024
Target: 10.0.10.50
Description: Annual security audit of internal HR application
Scope: https://10.0.10.50/*, 10.0.10.0/24
```

### External Engagement

```
Project Name: Client-ABC-Pentest-Jan2024
Target: client-abc.com
Description: Authorized penetration test per SOW dated 2024-01-15
Scope: https://client-abc.com/* (excluding /admin/prod/*)
```

## Getting Help

If you need assistance with your first project:

- **FAQ**: [faq.md](../troubleshooting/faq.md)
- **Troubleshooting**: [common-issues.md](../troubleshooting/common-issues.md)
- **Project Management**: [project-management/overview.md](../project-management/overview.md)
- **GitHub Issues**: [Report problems](https://github.com/theelderemo/cortexai/issues)

---

**Remember**: Always ensure you have proper authorization before testing any systems. CortexAI is designed for ethical, authorized penetration testing only.
