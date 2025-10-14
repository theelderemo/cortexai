# Asset Discovery

Discover and map target assets during penetration testing engagements.

## Overview

Asset discovery is the process of identifying and cataloging all resources within the testing scope. CortexAI provides both passive and active discovery capabilities with automatic site mapping and organization.

## Discovery Methods

### Passive Discovery

Identify assets without active probing:

**From HTTP Traffic**:
- Parse links from HTML responses
- Extract URLs from JavaScript
- Identify API endpoints
- Discover referenced resources

**From Headers and Responses**:
- Server headers
- Technology fingerprints
- Cookie domains
- Redirect chains

**Benefits**:
- Non-intrusive
- Stealth approach
- Low detection risk
- Safe for production

**Usage**:
```
> "Monitor traffic and discover assets passively"
> "Extract all links from the application"
```

### Active Discovery

Actively enumerate resources:

**Web Crawling**:
- Spider entire web application
- Follow all discovered links
- Parse forms and inputs
- Map application structure

**Directory Enumeration**:
- Test common paths
- Use wordlists
- Identify hidden resources
- Find backup files

**DNS Enumeration**:
- Subdomain discovery
- Zone transfers
- DNS brute forcing
- Historical DNS data

**Port Scanning**:
- Identify open ports
- Detect services
- Version detection
- OS fingerprinting

**Usage**:
```
> "Crawl the web application starting from https://example.com"
> "Discover hidden directories on the target"
> "Enumerate subdomains of example.com"
> "Scan ports on 192.168.1.100"
```

## Content Discovery

### Built-in Content Discovery

CortexAI includes dirb/gobuster-style content discovery:

```
> "Discover hidden content on https://example.com"
```

**Features**:
- Common path checking
- Multiple wordlists
- Extension fuzzing
- Status code filtering
- Recursive discovery

**Default Wordlist**:
- admin, login, dashboard
- config, backup, test
- api, v1, v2
- upload, files, static
- And many more common paths

### Custom Wordlists

Use custom wordlists:

```
> "Discover content using wordlist ['admin', 'secret', 'internal', 'api']"
```

### Recursive Discovery

Discover nested resources:

```
> "Recursively discover content starting from /admin"
```

## Site Mapping

### Hierarchical Structure

CortexAI organizes discoveries hierarchically:

```
https://example.com/
├── /
├── /about
├── /contact
├── /api/
│   ├── /api/v1/
│   │   ├── /api/v1/users
│   │   └── /api/v1/posts
│   └── /api/v2/
└── /admin/
    ├── /admin/login
    └── /admin/dashboard
```

**View Site Map**:
```
> "Show site map"
> "Display discovered assets in tree view"
> "List all discovered URLs"
```

### Asset Metadata

Each discovered asset includes:
- Full URL
- Discovery timestamp
- HTTP status code
- Content type
- Page title
- Parent/child relationships
- Custom metadata

**View Details**:
```
> "Show details for https://example.com/admin"
> "Display metadata for discovered assets"
```

## Scope-Aware Discovery

### Automatic Scope Checking

Discovery respects project scope:
- Only discovers in-scope resources
- Skips excluded patterns
- Validates before testing
- Logs scope violations

**Scope Enforcement**:
```
Include: https://example.com/*
Exclude: https://example.com/admin/production/*

Discovery will:
✓ Find https://example.com/admin/test
✗ Skip https://example.com/admin/production/config
```

### Cross-Domain Handling

Handling cross-domain references:

**In Scope**:
- Follow and catalog
- Add to site map
- Test normally

**Out of Scope**:
- Note reference
- Don't follow
- Log for review

## Discovery Techniques

### Web Application Discovery

Comprehensive web app mapping:

**Automated Crawling**:
```
> "Crawl https://example.com and discover all pages"
```

**Form Discovery**:
```
> "Find all forms and input fields"
```

**API Endpoint Discovery**:
```
> "Discover API endpoints in the application"
```

**JavaScript Analysis**:
```
> "Analyze JavaScript files for hidden endpoints"
```

### Network Discovery

Infrastructure reconnaissance:

**Host Discovery**:
```
> "Discover active hosts on 192.168.1.0/24"
```

**Port Scanning**:
```
> "Scan common ports on discovered hosts"
```

**Service Identification**:
```
> "Identify services on 192.168.1.100"
```

### Subdomain Enumeration

Find all subdomains:

**Active Enumeration**:
```
> "Enumerate subdomains of example.com"
```

**DNS Brute Force**:
```
> "Brute force subdomains using common wordlist"
```

**Certificate Transparency**:
```
> "Check certificate transparency logs for subdomains"
```

## Technology Detection

### Web Technologies

Identify technologies in use:

**Server Detection**:
- Web server type and version
- Application framework
- Programming language
- Database system

**Client-Side**:
- JavaScript libraries
- CSS frameworks
- Frontend technologies
- CDN usage

**Usage**:
```
> "Identify web technologies used by the target"
> "Fingerprint the web server"
```

### Security Technologies

Detect security controls:

**WAF Detection**:
```
> "Check if target uses a web application firewall"
```

**Security Headers**:
```
> "Analyze security headers on the target"
```

**Protection Mechanisms**:
```
> "Identify anti-bot and rate limiting measures"
```

## Best Practices

### Start Passive

**Initial Reconnaissance**:
1. Begin with passive discovery
2. Gather publicly available information
3. Build initial asset list
4. Review before active testing

### Gradual Escalation

**Progressive Discovery**:
1. Passive discovery first
2. Light active discovery
3. Intensive enumeration
4. Monitor impact throughout

### Organize Discoveries

**Maintain Structure**:
- Use site map feature
- Tag asset types
- Note interesting findings
- Document relationships

### Verify Scope

**Before Discovery**:
- Confirm scope boundaries
- Set up exclusions
- Test scope rules
- Review authorization

**During Discovery**:
- Monitor scope compliance
- Flag edge cases
- Document decisions
- Stay within boundaries

## Managing Discovered Assets

### Viewing Assets

List all discovered resources:

```
> "Show all discovered assets"
> "List URLs discovered in the last hour"
> "Display assets by status code"
```

### Filtering Assets

Find specific asset types:

```
> "Show all API endpoints"
> "List admin pages"
> "Find all JavaScript files"
> "Display 404 responses"
```

### Asset Tagging

Tag assets for organization:

```
> "Tag https://example.com/admin as admin-panel"
> "Mark https://example.com/api/* as api-endpoint"
```

### Exporting Assets

Export discovery results:

```
> "Export discovered assets to JSON"
> "Generate site map report"
> "Create asset inventory"
```

## Discovery Tools Integration

### Nmap Integration

Network scanning:

```
> "Run nmap scan on 192.168.1.0/24"
> "Perform service detection with nmap"
```

### Gobuster/Dirb

Directory brute forcing:

```
> "Use gobuster to find hidden directories"
> "Run dirb scan on https://example.com"
```

### Custom Tools

Use any installed tool:

```
> "Run subfinder to enumerate subdomains"
> "Execute custom discovery script"
```

## Troubleshooting

### No Assets Discovered

**Issue**: Discovery returns no results

**Solutions**:
- Verify target is accessible
- Check scope configuration
- Try different discovery methods
- Review network connectivity

### Too Many False Positives

**Issue**: Excessive irrelevant discoveries

**Solutions**:
- Refine scope rules
- Adjust status code filters
- Use more specific wordlists
- Filter by content type

### Discovery Taking Too Long

**Issue**: Slow discovery process

**Solutions**:
- Reduce wordlist size
- Limit recursion depth
- Adjust timeout settings
- Use targeted discovery

### Scope Violations

**Issue**: Discovering out-of-scope resources

**Solutions**:
- Review scope rules
- Check pattern matching
- Add more exclusions
- Verify authorization

## Advanced Discovery

### API Discovery

Find hidden API endpoints:

```
> "Discover API endpoints through JavaScript analysis"
> "Find GraphQL endpoints and schema"
> "Identify REST API versions"
```

### Parameter Discovery

Find hidden parameters:

```
> "Discover hidden GET parameters"
> "Find POST parameter names"
> "Identify API parameter structure"
```

### Version Detection

Identify application versions:

```
> "Detect application version information"
> "Find version strings in responses"
```

## Next Steps

After asset discovery:

- **Vulnerability Assessment**: [Security Testing](../security-testing/web-application.md)
- **Scope Management**: [Scope Management](scope-management.md)
- **Project Organization**: [Project Management](overview.md)

## Getting Help

For asset discovery assistance:

- **FAQ**: [Frequently Asked Questions](../troubleshooting/faq.md)
- **Troubleshooting**: [Troubleshooting Guide](../troubleshooting/common-issues.md)
- **Tools**: [Supported Tools](../tools/supported-tools.md)

---

**Remember**: Always respect scope boundaries and only discover assets you're authorized to test.
