# Project Management Overview

Understanding CortexAI's comprehensive project management system for penetration testing engagements.

## Introduction

CortexAI includes a sophisticated Project Management Engine designed specifically for penetration testing workflows. Each project is self-contained, providing complete engagement tracking, evidence collection, and vulnerability management.

## What is a Project?

A CortexAI project is a complete penetration testing engagement container that includes:

- **SQLite Database**: Self-contained data storage
- **Configuration**: Project settings and preferences
- **Scope Rules**: Include/exclude patterns for testing boundaries
- **Site Map**: Hierarchical view of discovered assets
- **Vulnerabilities**: Identified security issues with evidence
- **Evidence Locker**: HTTP requests/responses and tool outputs
- **Audit Trail**: Complete testing history

##Core Concepts

### Self-Contained Projects

Each project operates independently:
- Separate database file per project
- Individual scope definitions
- Isolated evidence storage
- Independent configuration

**Benefits**:
- No cross-contamination between projects
- Easy backup and archival
- Portable project files
- Concurrent project support

### Project Lifecycle

**Creation**:
1. Define project metadata (name, target, description)
2. Set initial scope rules
3. Initialize database schema
4. Launch monitoring tools

**Active Testing**:
1. Discover assets and map targets
2. Perform security testing
3. Document vulnerabilities
4. Collect evidence
5. Monitor progress

**Completion**:
1. Review all findings
2. Export reports
3. Archive project
4. Backup database

## Project Structure

### Directory Layout

```
projects/
└── My-Project-Name.db
```

Each project is a single SQLite database file containing all project data.

### Database Schema

The project database includes these tables:

**sites**: Discovered assets and URLs
```sql
- id: Unique identifier
- url: Full URL of the asset
- discovered_at: Discovery timestamp
- parent_id: Parent site reference
- status_code: HTTP status
- content_type: Response content type
- title: Page title
- metadata: Additional information
```

**vulnerabilities**: Security findings
```sql
- id: Unique identifier
- title: Vulnerability name
- description: Detailed description
- severity: Critical/High/Medium/Low/Info
- cwe_id: Common Weakness Enumeration ID
- owasp_category: OWASP classification
- url: Affected URL
- parameter: Vulnerable parameter
- payload: Exploit payload used
- evidence: Supporting evidence
- status: New/Confirmed/False Positive/etc.
- created_at: Discovery timestamp
- updated_at: Last modification
```

**http_evidence**: Request/response pairs
```sql
- id: Unique identifier
- vulnerability_id: Linked vulnerability
- request_headers: HTTP request headers
- request_body: HTTP request body
- response_headers: HTTP response headers
- response_body: HTTP response body
- timestamp: Capture time
```

**scope_rules**: Testing boundaries
```sql
- id: Unique identifier
- rule_type: include/exclude
- pattern_type: url/regex/cidr
- pattern: Rule pattern
- description: Rule description
- created_at: Creation timestamp
```

See [Database Schema](../reference/database-schema.md) for complete details.

## Project Features

### Automatic Asset Discovery

CortexAI discovers assets through:

**Passive Discovery**:
- Monitoring traffic and responses
- Extracting links from pages
- Identifying referenced resources
- Discovering API endpoints

**Active Discovery**:
- Web crawling
- Directory enumeration
- Content discovery tools
- DNS enumeration

All discovered assets are automatically:
- Added to site map
- Checked against scope
- Cataloged with metadata
- Available for testing

### Vulnerability Management

Complete vulnerability tracking:

**Detection**:
- Automatic pattern recognition
- Tool output parsing
- Manual logging
- AI-assisted identification

**Documentation**:
- Detailed descriptions
- Severity classification
- OWASP categorization
- CWE mapping
- Evidence linking

**Status Tracking**:
- New: Freshly discovered
- Confirmed: Verified and validated
- False Positive: Not a real issue
- Remediated: Fixed by client
- Risk Accepted: Acknowledged but not fixed

See [Vulnerability Tracking](vulnerability-tracking.md) for details.

### Evidence Collection

Comprehensive evidence storage:

**HTTP Evidence**:
- Full request headers and body
- Complete response headers and body
- Timestamp and context
- Linked to specific vulnerabilities

**Tool Output**:
- Command execution results
- Scanner output
- Test results
- Screenshots

**Chain of Custody**:
- Automatic timestamping
- Audit trail
- Tamper-evident storage
- Export capabilities

See [Evidence Collection](evidence-collection.md) for details.

### Scope Management

Precise testing boundary control:

**Include Rules**:
- Define what is in scope
- Multiple pattern types
- Hierarchical matching
- Priority ordering

**Exclude Rules**:
- Define what is out of scope
- Override include rules
- Protect sensitive areas
- Prevent accidents

**Pattern Types**:
- URL patterns with wildcards
- Regular expressions
- CIDR network ranges
- IP address ranges

See [Scope Management](scope-management.md) for details.

## Working with Projects

### Creating Projects

When you start CortexAI, you'll see:

```
Project Management System
========================

[1] Create new project
[2] Open existing project
[3] List all projects

Choose an option (1-3):
```

**Option 1 - New Project**:
- Enter project details
- Define initial scope
- Configure settings
- Launch database viewer

**Option 2 - Open Existing**:
- Select from project list
- Resume where you left off
- All data preserved
- Continue testing

**Option 3 - List Projects**:
- View all projects
- See project metadata
- Check last access
- Review project status

### Project Operations

**During Active Session**:
```
> "Show project status"
> "Add target to scope"
> "List discovered assets"
> "View vulnerabilities"
> "Export findings"
```

**Management Commands**:
```
> "Create backup of project"
> "Export project data"
> "Launch database viewer"
> "Show testing statistics"
```

### Database Viewer

Real-time project monitoring:

**Access**:
- Automatic launch on project creation
- Manual launch: `> "Launch database viewer"`
- Web-based interface
- Live data updates

**Features**:
- Browse all tables
- Query project data
- View relationships
- Export results
- Real-time monitoring

**Views**:
- Dashboard: Project overview
- Assets: Site map and discoveries
- Vulnerabilities: Security findings
- Evidence: HTTP captures
- Scope: Testing boundaries

## Project Best Practices

### Organization

**Naming Conventions**:
- Use descriptive names
- Include client/target identifier
- Add date if time-boxed
- Avoid special characters

**Examples**:
- `ClientName-WebApp-Q1-2024`
- `BugBounty-ExampleCom`
- `Internal-Network-Audit`

### Scope Definition

**Start Narrow**:
- Define clear boundaries from the beginning
- Start conservative
- Expand carefully
- Document all changes

**Be Specific**:
- Use precise patterns
- Avoid overly broad rules
- Test scope rules
- Review regularly

### Evidence Collection

**Capture Everything**:
- Let CortexAI auto-collect evidence
- Document all findings
- Save tool outputs
- Take notes

**Organize Well**:
- Link evidence to vulnerabilities
- Add context and notes
- Maintain chain of custody
- Regular backups

### Regular Backups

**Backup Strategy**:
- Daily backups during active testing
- Copy database file
- Store securely
- Test restores

**Backup Locations**:
```bash
# Local backup
cp projects/MyProject.db backups/MyProject-2024-01-15.db

# Remote backup
rsync -av projects/ user@backup-server:/cortexai-backups/
```

## Project Maintenance

### Database Health

Monitor database size and performance:

```bash
# Check database size
ls -lh projects/*.db

# Vacuum database (optimize)
sqlite3 projects/MyProject.db "VACUUM;"

# Check integrity
sqlite3 projects/MyProject.db "PRAGMA integrity_check;"
```

### Archiving Old Projects

Archive completed projects:

```bash
# Create archive directory
mkdir -p archive/2024

# Move completed projects
mv projects/CompletedProject.db archive/2024/

# Compress for long-term storage
gzip archive/2024/CompletedProject.db
```

### Project Export

Export project data for reporting:

```
> "Export vulnerabilities to JSON"
> "Generate HTML report"
> "Export evidence for vulnerability 5"
> "Create summary report"
```

## Troubleshooting

### Database Locked

**Issue**: "Database is locked" error

**Solutions**:
- Close duplicate instances
- Check for zombie processes
- Wait for operations to complete
- Restart CortexAI if needed

### Corrupt Database

**Issue**: Database file corrupted

**Solutions**:
```bash
# Try recovery
sqlite3 projects/MyProject.db ".recover" > recovered.sql
sqlite3 projects/MyProject-recovered.db < recovered.sql

# Restore from backup
cp backups/MyProject-backup.db projects/MyProject.db
```

### Large Database

**Issue**: Project database growing too large

**Solutions**:
- Archive old evidence
- Remove duplicate entries
- Vacuum database
- Split into multiple projects

## Advanced Features

### Project Templates

Save and reuse project configurations:

```
> "Save current configuration as template"
> "Create project from template"
> "List available templates"
```

### Collaborative Projects

Share projects with team members:

```bash
# Export project
cp projects/SharedProject.db /shared/drive/

# Import project
cp /shared/drive/SharedProject.db projects/
```

**Note**: Be careful with sensitive data in shared projects.

### API Access

Query project data programmatically:

```javascript
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('projects/MyProject.db');

db.all('SELECT * FROM vulnerabilities WHERE severity = "High"', (err, rows) => {
  console.log(rows);
});
```

## Next Steps

Learn more about specific project features:

- **Scope Management**: [Scope Management Guide](scope-management.md)
- **Asset Discovery**: [Asset Discovery Guide](asset-discovery.md)
- **Vulnerability Tracking**: [Vulnerability Tracking Guide](vulnerability-tracking.md)
- **Evidence Collection**: [Evidence Collection Guide](evidence-collection.md)

## Getting Help

For project management assistance:

- **FAQ**: [Frequently Asked Questions](../help/faq.md)
- **Troubleshooting**: [Troubleshooting Guide](../help/troubleshooting.md)
- **Database Reference**: [Database Schema](../reference/database-schema.md)

---

**Remember**: Projects contain sensitive security data. Always protect project files and handle them securely.
