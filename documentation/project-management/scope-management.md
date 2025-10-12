# Scope Management

Define and manage testing boundaries to ensure safe and authorized security testing.

## Overview

Scope management is critical for responsible penetration testing. CortexAI provides flexible scope definition using multiple pattern types, automatic scope enforcement, and real-time validation.

## Why Scope Matters

**Legal Protection**:
- Defines authorized targets
- Prevents accidental out-of-scope testing
- Demonstrates due diligence
- Protects from legal liability

**Technical Benefits**:
- Focuses testing efforts
- Prevents system overload
- Organizes discoveries
- Streamlines reporting

**Professional Standards**:
- Follows industry best practices
- Meets compliance requirements
- Maintains client trust
- Ensures quality results

## Scope Rule Types

### Include Rules

Define what is in scope for testing:

```
> "Add https://example.com/* to scope"
```

All testing activity must match at least one include rule.

### Exclude Rules

Define what must not be tested:

```
> "Exclude https://example.com/admin/production/* from scope"
```

Exclude rules override include rules for maximum safety.

## Pattern Types

### URL Patterns

Match web addresses with wildcards:

**Examples**:
```
https://example.com/*
https://example.com/api/*
https://*.example.com/*
https://example.com/*/admin
```

**Syntax**:
- `*` matches any characters
- `**` matches any path segments
- Case-insensitive matching

**Usage**:
```
> "Add https://webapp.example.com/* to scope"
> "Include https://api.example.com/v1/* in testing"
```

### Regular Expressions

Complex pattern matching:

**Examples**:
```
^https://example\.com/user/[0-9]+$
^https://.*\.example\.com/api/v[12]/.*$
^https://example\.com/(en|fr|de)/.*$
```

**Syntax**:
- Standard JavaScript regex
- Anchors recommended
- Case-sensitive by default

**Usage**:
```
> "Add regex pattern ^https://.*\.example\.com/api/.* to scope"
```

### CIDR Notation

Network ranges for infrastructure testing:

**Examples**:
```
192.168.1.0/24
10.0.0.0/8
172.16.0.0/12
```

**Syntax**:
- Standard CIDR notation
- IPv4 supported
- Subnet mask required

**Usage**:
```
> "Add 192.168.1.0/24 to scope"
> "Include network range 10.0.10.0/24 in testing"
```

### IP Address Ranges

Specific IP ranges:

**Examples**:
```
192.168.1.1-192.168.1.50
10.0.0.10-10.0.0.20
```

**Syntax**:
- Start IP - End IP format
- IPv4 supported
- Inclusive range

**Usage**:
```
> "Add IP range 192.168.1.100-192.168.1.150 to scope"
```

## Defining Scope

### Initial Scope Setup

During project creation, define initial scope:

```
Project Name: WebApp-Assessment
Target: webapp.example.com
Description: Security assessment of company web application

Add to scope: https://webapp.example.com/*
Exclude from scope: https://webapp.example.com/admin/production/*
```

### Adding Scope Rules

Add rules during testing:

```
> "Add https://api.example.com/* to scope"
> "Include subdomain https://staging.example.com/* in testing"
> "Add network 192.168.1.0/24 to scope"
```

### Removing Scope Rules

Remove rules when needed:

```
> "Remove https://staging.example.com from scope"
> "Delete scope rule for 192.168.2.0/24"
```

### Viewing Current Scope

Check active scope rules:

```
> "Show current testing scope"
> "List all scope rules"
> "Display include and exclude rules"
```

## Scope Enforcement

### Automatic Checking

CortexAI automatically checks targets against scope:

**Before Testing**:
- Validates target is in scope
- Checks exclude rules
- Warns if uncertain
- Requires confirmation for edge cases

**During Testing**:
- Continuous scope validation
- Prevents out-of-scope requests
- Logs scope checks
- Alerts on violations

### Scope Validation

Test if a target is in scope:

```
> "Is https://example.com/test in scope?"
> "Check if 192.168.1.50 is within testing scope"
> "Validate scope for https://api.example.com/v1/users"
```

### Override Warnings

For legitimate out-of-scope testing:

1. Verify you have authorization
2. Document the reason
3. Confirm when prompted
4. Test cautiously

**Example**:
```
> "Test https://out-of-scope.example.com"

⚠️ WARNING: This target appears to be out of scope
Current scope: https://example.com/*
Target: https://out-of-scope.example.com

Do you have authorization to test this target? (yes/no):
```

## Scope Best Practices

### Start Conservative

**Initial Setup**:
- Define minimal necessary scope
- Be specific, not broad
- Add exclusions for sensitive areas
- Test scope rules

**Example**:
```
Include: https://test.example.com/app/*
Exclude: https://test.example.com/app/admin/*
Exclude: https://test.example.com/app/payment/*
```

### Expand Carefully

**Adding Scope**:
- Verify authorization first
- Document scope changes
- Test new areas cautiously
- Monitor for issues

**Example**:
```
> "I have authorization to expand scope to include https://api.example.com/*"
> "Add https://api.example.com/* to scope"
> "Document: Added API testing per client email 2024-01-15"
```

### Document Everything

**Scope Documentation**:
- Record authorization details
- Note scope changes
- Document exclusions
- Save communications

### Common Scope Patterns

**Web Application Testing**:
```
Include: https://webapp.example.com/*
Include: https://www.example.com/*
Exclude: */logout
Exclude: */delete
Exclude: */admin/production/*
```

**API Testing**:
```
Include: https://api.example.com/v1/*
Include: https://api.example.com/v2/*
Exclude: */admin/*
Exclude: */internal/*
```

**Network Testing**:
```
Include: 192.168.1.0/24
Include: 10.0.10.0/24
Exclude: 192.168.1.1    # Router
Exclude: 192.168.1.10   # Domain controller
```

**Bug Bounty Programs**:
```
Include: https://*.example.com/*
Exclude: https://payment.example.com/*
Exclude: https://admin.example.com/*
Exclude: https://*.example.com/admin/*
```

## Scope Scenarios

### Scenario 1: Simple Web Application

**Target**: Company web application

**Scope Definition**:
```
Include:
- https://app.company.com/*

Exclude:
- https://app.company.com/logout
- https://app.company.com/user/delete/*
```

**Rationale**:
- Single web application
- Protect user sessions (logout)
- Prevent data loss (delete operations)

### Scenario 2: Multi-Domain Assessment

**Target**: Multiple company domains

**Scope Definition**:
```
Include:
- https://www.company.com/*
- https://app.company.com/*
- https://api.company.com/*
- https://blog.company.com/*

Exclude:
- https://*/admin/production/*
- https://api.company.com/internal/*
```

**Rationale**:
- Multiple domains in scope
- Protect production admin interfaces
- Exclude internal-only APIs

### Scenario 3: Network Assessment

**Target**: Internal network segment

**Scope Definition**:
```
Include:
- 192.168.10.0/24
- 172.16.5.0/24

Exclude:
- 192.168.10.1      # Gateway
- 192.168.10.5      # DNS server
- 192.168.10.10     # Domain controller
- 172.16.5.100      # Production database
```

**Rationale**:
- Two network segments
- Protect critical infrastructure
- Avoid service disruption

### Scenario 4: Bug Bounty Program

**Target**: Public bug bounty scope

**Scope Definition**:
```
Include:
- https://*.example.com/*
- https://example.com/*

Exclude:
- https://status.example.com/*
- https://jobs.example.com/*
- https://investors.example.com/*
- https://*/3rdparty/*
```

**Rationale**:
- Wildcard subdomain inclusion
- Exclude non-technical pages
- Exclude third-party integrations
- Follow program rules

## Managing Scope Changes

### Adding New Targets

When authorization expands:

1. **Verify Authorization**:
   - Get written confirmation
   - Understand new boundaries
   - Clarify any restrictions

2. **Update Scope**:
   ```
   > "Add https://newapp.example.com/* to scope"
   ```

3. **Document Change**:
   ```
   > "Note: Scope expanded to include newapp per client approval 2024-01-20"
   ```

4. **Test Cautiously**:
   - Start with passive reconnaissance
   - Verify access is expected
   - Watch for issues

### Removing Targets

When scope is reduced:

1. **Remove from Scope**:
   ```
   > "Remove https://staging.example.com from scope"
   ```

2. **Stop Active Testing**:
   - Cease all testing on removed targets
   - Clear any cached data
   - Update notes

3. **Document Change**:
   ```
   > "Note: Staging environment removed from scope at client request"
   ```

## Troubleshooting Scope

### Scope Too Broad

**Issue**: Accidentally defined overly broad scope

**Solution**:
```
> "Remove overly broad rule: https://*/* "
> "Add specific rule: https://example.com/*"
> "Review all current scope rules"
```

### Target Not Matching

**Issue**: Legitimate target not matching scope

**Solution**:
```
> "Test scope rule for https://app.example.com/test"
> "Add missing pattern: https://app.example.com/*"
> "Verify scope now includes target"
```

### Conflicting Rules

**Issue**: Include and exclude rules conflict

**Solution**:
- Exclude rules always override include rules
- Review rule order
- Make exclusions more specific
- Test with validation command

### Pattern Not Working

**Issue**: Regex or pattern not matching correctly

**Solution**:
```
> "Test pattern ^https://.*\.example\.com/.* against https://sub.example.com/path"
> "Check regex syntax"
> "Try simpler URL pattern first"
```

## Advanced Scope Techniques

### Dynamic Scope Expansion

Gradually expand scope during testing:

```
Day 1: https://example.com/*
Day 2: Add https://www.example.com/*
Day 3: Add https://api.example.com/*
Day 4: Add https://*.example.com/*
```

### Temporary Scope Additions

For specific tests:

```
> "Temporarily add https://staging.example.com/* to scope for testing"
> "Run specific tests"
> "Remove https://staging.example.com from scope after completion"
```

### Scope Templates

Save common scope configurations:

```
> "Save current scope as template: bug-bounty-standard"
> "Create new project from template: bug-bounty-standard"
```

## Next Steps

Related documentation:

- **Asset Discovery**: [Asset Discovery Guide](asset-discovery.md)
- **Project Management**: [Project Management Overview](overview.md)
- **Legal Guidelines**: [Legal Guidelines](../legal/legal-guidelines.md)

## Getting Help

For scope management assistance:

- **FAQ**: [Frequently Asked Questions](../help/faq.md)
- **Best Practices**: [Best Practices Guide](../workflows/best-practices.md)
- **GitHub**: [Report Issues](https://github.com/theelderemo/cortexai/issues)

---

**Critical Reminder**: Always ensure you have explicit authorization before defining testing scope. When in doubt, ask for clarification.
