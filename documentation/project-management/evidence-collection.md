# Evidence Collection

Comprehensive evidence management for penetration testing engagements.

## Overview

Proper evidence collection is critical for penetration testing. CortexAI automatically captures and stores evidence with tamper-evident timestamps and maintains a complete chain of custody.

## Types of Evidence

### HTTP Evidence

**Automatic Capture**:
- Full HTTP requests
- Complete responses
- Headers and bodies
- Timestamps
- Associated vulnerabilities

**What's Captured**:
```
Request:
- Method (GET, POST, etc.)
- URL
- Headers
- Body/Parameters

Response:
- Status code
- Headers  
- Body content
- Timing information
```

**Viewing HTTP Evidence**:
```
> "Show HTTP evidence for vulnerability 5"
> "Display request/response for SQL injection"
```

### Tool Output

Command execution results:

**Captured Data**:
- Command executed
- Full output
- Exit code
- Execution timestamp
- Working directory

**Examples**:
```
> "Store nmap output as evidence"
> "Save gobuster results"
> "Attach SQLMap output to finding"
```

### Screenshots

Visual documentation:

**Use Cases**:
- XSS proof of concept
- Authentication bypasses
- Visual anomalies
- Error messages
- Admin panel access

**Adding Screenshots**:
```
> "Attach screenshot to vulnerability"
> "Save visual evidence"
```

### Logs and Traces

Additional supporting evidence:

- Application logs
- Debug output
- Stack traces
- Error messages
- Configuration files

## Automatic Evidence Collection

### On Vulnerability Detection

When vulnerabilities are detected, CortexAI automatically:

1. **Captures HTTP Transaction**:
   - Request that triggered the finding
   - Response that revealed the issue
   - All headers and body content

2. **Records Context**:
   - Discovery timestamp
   - Testing method used
   - Tool or technique
   - Related assets

3. **Links to Vulnerability**:
   - Stored in database
   - Associated with finding ID
   - Retrievable for reporting

### On Security Testing

During active testing:

**Request Logging**:
- Significant HTTP requests
- Anomalous responses
- Error conditions
- Successful exploits

**Tool Execution**:
- Command outputs
- Scan results
- Enumeration data
- Test results

## Manual Evidence Collection

### Adding Evidence

Manually store evidence:

```
> "Add evidence to vulnerability 5"
> "Store HTTP transaction for XSS finding"
> "Attach tool output to SQL injection"
```

**With Details**:
```
> "Store evidence: 
Type: HTTP
Vulnerability: 5
Request: GET /search?q=<script>alert(1)</script>
Response: [Full response with XSS payload executed]"
```

### Evidence Types

**HTTP Transaction**:
```
> "Capture HTTP request/response for current test"
```

**File Evidence**:
```
> "Attach file /path/to/output.txt to vulnerability 10"
```

**Text Evidence**:
```
> "Add note to evidence: Vulnerability confirmed with manual testing"
```

## Evidence Management

### Viewing Evidence

Access stored evidence:

```
> "Show all evidence"
> "List evidence for vulnerability 5"
> "Display evidence by type"
```

**Detailed View**:
```
> "Show full HTTP evidence ID 15"
> "Display complete request/response"
```

### Filtering Evidence

Find specific evidence:

```
> "Show HTTP evidence only"
> "List evidence from last 24 hours"
> "Display evidence for high severity findings"
```

### Exporting Evidence

Export for reporting:

```
> "Export evidence for vulnerability 5"
> "Generate evidence package for all findings"
> "Create evidence report in JSON format"
```

## Chain of Custody

### Tamper-Evident Storage

Evidence integrity features:

**Timestamps**:
- Collection time
- Modification time
- Access time

**Metadata**:
- Who collected it
- How it was collected
- What tool was used
- Associated finding

**Immutability**:
- Original evidence preserved
- Changes tracked
- Audit trail maintained

### Audit Trail

Complete evidence history:

```
> "Show audit trail for evidence 10"
> "Display evidence access log"
> "List evidence modifications"
```

## Evidence Best Practices

### Capture Everything

**Comprehensive Collection**:
- Capture full requests/responses
- Save all tool outputs
- Document every test
- Record all findings

### Immediate Collection

**Timely Capture**:
- Collect evidence immediately
- Don't rely on memory
- Timestamp everything
- Link to context

### Organized Storage

**Structure Evidence**:
- Link to vulnerabilities
- Tag by type
- Add descriptions
- Maintain relationships

### Protect Integrity

**Evidence Protection**:
- No modifications
- Secure storage
- Access controls
- Regular backups

## Evidence in Reporting

### Including Evidence

Evidence in vulnerability reports:

**Request/Response Pairs**:
- Shows exact exploitation
- Proves vulnerability exists
- Enables reproduction
- Demonstrates impact

**Tool Output**:
- Technical validation
- Scan confirmation
- Enumeration proof
- Testing evidence

**Screenshots**:
- Visual proof
- UI impacts
- Error messages
- Success indicators

### Evidence Formatting

**For Reports**:
```
> "Format evidence for report"
> "Generate evidence appendix"
> "Create technical proof section"
```

## Evidence Storage

### Database Storage

Evidence stored in SQLite:

**http_evidence table**:
```sql
CREATE TABLE http_evidence (
  id INTEGER PRIMARY KEY,
  vulnerability_id INTEGER,
  request_method TEXT,
  request_url TEXT,
  request_headers TEXT,
  request_body TEXT,
  response_status INTEGER,
  response_headers TEXT,
  response_body TEXT,
  timestamp DATETIME
);
```

### File System Storage

Large evidence files:

**Structure**:
```
projects/
└── ProjectName.db
└── evidence/
    ├── screenshots/
    ├── tool_outputs/
    └── captures/
```

## Evidence Types by Vulnerability

### SQL Injection Evidence

**Critical Evidence**:
- Original request with payload
- Database error response
- Extracted data (if applicable)
- Tool output (SQLMap, etc.)

**Example**:
```
Request: POST /login
Body: username=admin' OR '1'='1'--&password=test
Response: Database error: mysql_fetch_array() expects parameter 1
```

### XSS Evidence

**Critical Evidence**:
- Request with payload
- Response showing reflection
- Browser execution proof
- Screenshot of alert/impact

**Example**:
```
Request: GET /search?q=<script>alert(document.cookie)</script>
Response: <div>Results for: <script>alert(document.cookie)</script></div>
Screenshot: Alert box displaying session cookie
```

### Authentication Bypass Evidence

**Critical Evidence**:
- Original authentication request
- Bypass technique used
- Unauthorized access achieved
- Screenshot of protected resource

**Example**:
```
Request: GET /admin with modified cookie
Response: 200 OK - Admin Dashboard
Screenshot: Full admin panel access
```

## Troubleshooting

### Evidence Not Captured

**Issue**: Automatic capture failed

**Solutions**:
- Check database permissions
- Verify storage space
- Review configuration
- Manually capture evidence

### Evidence Too Large

**Issue**: Response bodies very large

**Solutions**:
- Truncate large responses
- Store summary instead
- Link to external file
- Compress evidence

### Missing Context

**Issue**: Evidence lacks context

**Solutions**:
- Add descriptive notes
- Link to vulnerability
- Include timestamps
- Document methodology

## Advanced Evidence Features

### Evidence Templates

Create reusable evidence formats:

```
> "Create evidence template for SQL injection"
> "Use XSS evidence template"
```

### Bulk Evidence Operations

Manage multiple evidence items:

```
> "Export all evidence for high severity findings"
> "Tag all HTTP evidence from /admin path"
```

### Evidence Search

Find specific evidence:

```
> "Search evidence for 'database error'"
> "Find evidence containing 'admin' in URL"
```

### Evidence Comparison

Compare related evidence:

```
> "Compare evidence before and after fix"
> "Show differences in HTTP responses"
```

## Compliance and Legal

### Evidence Standards

Meeting legal requirements:

**Documentation**:
- Complete and accurate
- Timestamped properly
- Chain of custody maintained
- Tamper-evident storage

**Preservation**:
- Original evidence retained
- Backups maintained
- Long-term storage
- Secure handling

### Data Sensitivity

Handling sensitive evidence:

**Redaction**:
- Remove passwords
- Mask personal data
- Sanitize credentials
- Protect PII

**Access Control**:
- Limit evidence access
- Log all access
- Require authentication
- Audit access patterns

## Evidence Retention

### Retention Policies

How long to keep evidence:

**Active Engagements**:
- Keep all evidence
- Regular backups
- Secure storage
- Easy access

**Completed Engagements**:
- Archive evidence
- Compress for storage
- Maintain for N years
- Secure deletion after retention

### Evidence Archival

Archive old evidence:

```bash
# Export evidence
> "Export all evidence to archive"

# Compress for storage
tar -czf project-evidence-2024.tar.gz evidence/

# Secure deletion when appropriate
shred -u sensitive-evidence.txt
```

## Next Steps

Related documentation:

- **Vulnerability Tracking**: [Vulnerability Tracking Guide](vulnerability-tracking.md)
- **Reporting**: [Best Practices](../user-guide/best-practices.md)
- **Database Schema**: [Database Schema](../reference/database-schema.md)

## Getting Help

For evidence collection assistance:

- **FAQ**: [Frequently Asked Questions](../troubleshooting/faq.md)
- **Best Practices**: [Best Practices Guide](../user-guide/best-practices.md)
- **GitHub**: [Report Issues](https://github.com/theelderemo/cortexai/issues)

---

**Remember**: Proper evidence collection is essential for credible penetration testing reports and may have legal significance.
