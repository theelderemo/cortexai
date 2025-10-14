# Common Workflows

Typical penetration testing workflows and procedures using CortexAI.

## Overview

This guide covers common penetration testing workflows from initial reconnaissance through final reporting. Each workflow provides step-by-step procedures using CortexAI's natural language interface and project management features.

## Web Application Assessment Workflow

### Phase 1: Project Setup

**Create Project**:
```
> "Create a new project for testing webapp.example.com"

Project Name: WebApp-Assessment-2024
Target: webapp.example.com
Description: Security assessment of company web application
```

**Define Scope**:
```
> "Add https://webapp.example.com/* to scope"
> "Exclude https://webapp.example.com/admin/production/* from scope"
> "Exclude /logout and /delete paths from testing"
```

**Launch Monitoring**:
```
> "Launch database viewer"
```

### Phase 2: Information Gathering

**Passive Reconnaissance**:
```
> "Perform passive reconnaissance on webapp.example.com"
> "Identify web technologies used"
> "Check for publicly available information"
```

**Active Discovery**:
```
> "Crawl the web application starting from homepage"
> "Discover hidden directories and files"
> "Map the site structure"
```

### Phase 3: Vulnerability Assessment

**Automated Scanning**:
```
> "Check for common web vulnerabilities"
> "Test for SQL injection in all input fields"
> "Scan for XSS vulnerabilities"
```

**Manual Testing**:
```
> "Test authentication mechanisms for bypass vulnerabilities"
> "Check for authorization issues"
> "Analyze session management"
```

### Phase 4: Exploitation

**Verify Findings**:
```
> "Manually verify SQL injection in login form"
> "Test XSS payload execution"
> "Confirm authentication bypass"
```

**Document Evidence**:
```
> "Store HTTP evidence for SQL injection finding"
> "Capture XSS proof of concept"
> "Document all vulnerabilities found"
```

### Phase 5: Reporting

**Generate Reports**:
```
> "Show all discovered vulnerabilities"
> "Generate vulnerability summary report"
> "Export evidence for all findings"
```

**Complete Project**:
```
> "Create final assessment report"
> "Archive project data"
```

## Network Security Assessment Workflow

### Phase 1: Project Setup

**Create Project**:
```
Project Name: Network-Assessment-2024
Target: 192.168.1.0/24
Description: Internal network security assessment
```

**Define Network Scope**:
```
> "Add 192.168.1.0/24 to scope"
> "Exclude 192.168.1.1 from testing"  # Gateway
> "Exclude 192.168.1.5 from testing"  # DNS Server
```

### Phase 2: Network Discovery

**Host Discovery**:
```
> "Discover active hosts on 192.168.1.0/24"
> "Identify live systems on the network"
```

**Service Enumeration**:
```
> "Scan common ports on discovered hosts"
> "Identify services running on each host"
> "Detect service versions"
```

### Phase 3: Vulnerability Scanning

**System Assessment**:
```
> "Check for vulnerable services"
> "Scan for missing patches"
> "Identify security misconfigurations"
```

**Specific Testing**:
```
> "Test SMB configuration on Windows hosts"
> "Check SSH configuration on Linux servers"
> "Verify firewall rules"
```

### Phase 4: Exploitation and Verification

**Verify Vulnerabilities**:
```
> "Manually verify critical findings"
> "Test exploitation of high-risk vulnerabilities"
> "Document successful access"
```

### Phase 5: Documentation

**Complete Assessment**:
```
> "List all network vulnerabilities"
> "Generate network security report"
> "Create remediation recommendations"
```

## API Security Testing Workflow

### Phase 1: API Discovery

**Identify Endpoints**:
```
> "Discover API endpoints in the application"
> "Map API structure and versions"
> "Document API authentication methods"
```

### Phase 2: API Testing

**Authentication Testing**:
```
> "Test API authentication mechanisms"
> "Check for authentication bypass"
> "Verify token security"
```

**Authorization Testing**:
```
> "Test API authorization controls"
> "Check for IDOR vulnerabilities"
> "Verify access controls"
```

**Input Validation**:
```
> "Test API input validation"
> "Check for injection vulnerabilities"
> "Test file upload endpoints"
```

### Phase 3: Business Logic

**Workflow Testing**:
```
> "Test API business logic"
> "Check for rate limiting"
> "Verify data validation"
```

## Bug Bounty Workflow

### Phase 1: Program Research

**Understand Scope**:
```
Project Name: BugBounty-ExampleCorp
Target: Multiple domains per program
Description: Bug bounty testing for ExampleCorp
```

**Configure Scope**:
```
> "Add all in-scope domains from bug bounty program"
> "Exclude out-of-scope domains"
> "Document program-specific rules"
```

### Phase 2: Reconnaissance

**Broad Discovery**:
```
> "Enumerate all subdomains"
> "Discover hidden endpoints"
> "Map entire attack surface"
```

### Phase 3: Targeted Testing

**Focus on High-Value Targets**:
```
> "Test authentication systems"
> "Check payment processing"
> "Test sensitive functionality"
```

### Phase 4: Responsible Disclosure

**Document and Report**:
```
> "Create detailed vulnerability report"
> "Include reproduction steps"
> "Provide remediation guidance"
```

## Compliance Testing Workflow

### Phase 1: Requirements Analysis

**Identify Requirements**:
```
Project Name: PCI-DSS-Assessment-2024
Target: Cardholder Data Environment
Description: PCI DSS compliance testing
```

**Map Controls**:
```
> "Document required security controls"
> "Plan testing approach for each control"
```

### Phase 2: Control Testing

**Test Controls**:
```
> "Test access controls"
> "Verify encryption implementation"
> "Check audit logging"
> "Test segmentation controls"
```

### Phase 3: Documentation

**Compliance Reporting**:
```
> "Generate compliance assessment report"
> "Map findings to requirements"
> "Document control effectiveness"
```

## Continuous Testing Workflow

### Regular Assessment

**Schedule**:
```
> "Create quarterly security assessment project"
> "Use previous project as baseline"
> "Compare current vs previous findings"
```

**Monitor Changes**:
```
> "Test new features and functionality"
> "Verify remediation of previous findings"
> "Identify new vulnerabilities"
```

## Workflow Best Practices

### Systematic Approach

1. **Plan before testing**
2. **Document everything**
3. **Verify all findings**
4. **Communicate regularly**
5. **Follow methodology**

### CortexAI Features

**Leverage Platform**:
- Project management
- Scope enforcement
- Automatic evidence collection
- Vulnerability tracking
- Organized reporting

### Efficiency Tips

**Work Smarter**:
- Use templates for similar projects
- Reuse scope configurations
- Automate repetitive tasks
- Maintain testing checklists
- Learn from each engagement

## Next Steps

Related documentation:

- **Best Practices**: [Best Practices Guide](best-practices.md)
- **Advanced Techniques**: [Advanced Techniques](advanced-techniques.md)
- **Security Testing Guides**: [Web Application Testing](../security-testing/web-application.md)

---

**Remember**: These workflows are starting points. Adapt them based on specific engagement requirements, target characteristics, and findings discovered during testing.
