# Advanced Configuration

Advanced configuration options for power users and specialized deployments of CortexAI.

## Overview

This guide covers advanced configuration topics including performance tuning, custom integrations, multi-user setups, and specialized deployment scenarios.

## Performance Optimization

### Memory Management

Configure memory usage for large projects:

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=8192"

# Set in .env
NODE_MEMORY_LIMIT=8192
```

### Database Performance

Optimize SQLite performance:

```bash
# Enable WAL mode for better concurrency
DB_WAL_MODE=true

# Set cache size (KB)
DB_CACHE_SIZE=10000

# Enable memory-mapped I/O
DB_MMAP_SIZE=30000000

# Synchronous mode (NORMAL balance, FULL safety)
DB_SYNC_MODE=NORMAL
```

### Request Optimization

Fine-tune API request behavior:

```bash
# Connection pooling
API_CONNECTION_POOL_SIZE=10

# Request timeout (seconds)
API_REQUEST_TIMEOUT=60

# Retry configuration
API_RETRY_ATTEMPTS=3
API_RETRY_BACKOFF=exponential
API_RETRY_DELAY=1000

# Concurrent requests limit
API_MAX_CONCURRENT=5
```

### Caching Configuration

Enable response caching to reduce API calls:

```bash
# Enable caching
ENABLE_RESPONSE_CACHE=true

# Cache directory
CACHE_DIR=./cache

# Cache TTL (seconds)
CACHE_TTL=3600

# Maximum cache size (MB)
CACHE_MAX_SIZE=500
```

## Custom Tool Integration

### External Tool Configuration

Configure paths for security tools:

```bash
# Tool paths (if not in system PATH)
NMAP_PATH=/usr/bin/nmap
BURP_PATH=/opt/BurpSuitePro/burpsuite
SQLMAP_PATH=/usr/share/sqlmap/sqlmap.py
GOBUSTER_PATH=/usr/bin/gobuster
```

### Tool Wrappers

Create custom tool wrappers:

```bash
# Custom tool wrapper directory
TOOL_WRAPPER_DIR=./tools/wrappers

# Enable custom wrappers
ENABLE_CUSTOM_WRAPPERS=true
```

### Script Execution

Configure script execution environments:

```bash
# Python interpreter
PYTHON_PATH=/usr/bin/python3

# Python virtual environment
PYTHON_VENV=./venv

# Shell for bash scripts
SHELL_PATH=/bin/bash

# PowerShell for Windows
POWERSHELL_PATH=/usr/bin/pwsh
```

## Multi-User Configuration

### User Management

Configure multi-user support:

```bash
# Enable multi-user mode
MULTI_USER_MODE=true

# User database location
USER_DB_PATH=./config/users.db

# Require authentication
REQUIRE_AUTH=true

# Session timeout (minutes)
SESSION_TIMEOUT=60
```

### Project Permissions

Set project access controls:

```bash
# Default project permissions
PROJECT_DEFAULT_PERMISSIONS=owner-rw

# Allow project sharing
ALLOW_PROJECT_SHARING=true

# Audit all access
AUDIT_PROJECT_ACCESS=true
```

## Network Configuration

### Proxy Settings

Advanced proxy configuration:

```bash
# HTTP/HTTPS proxy
HTTP_PROXY=http://proxy.company.com:8080
HTTPS_PROXY=http://proxy.company.com:8080

# SOCKS proxy support
SOCKS_PROXY=socks5://proxy.company.com:1080

# Proxy authentication
PROXY_USER=username
PROXY_PASS=password

# No proxy exceptions
NO_PROXY=localhost,127.0.0.1,*.local,.internal
```

### TLS/SSL Configuration

Configure SSL/TLS settings:

```bash
# Certificate verification
TLS_REJECT_UNAUTHORIZED=true

# Custom CA certificate
TLS_CA_CERT=/path/to/ca-cert.pem

# Client certificate authentication
TLS_CLIENT_CERT=/path/to/client-cert.pem
TLS_CLIENT_KEY=/path/to/client-key.pem

# Minimum TLS version
TLS_MIN_VERSION=TLSv1.2
```

### DNS Configuration

Custom DNS settings:

```bash
# DNS servers
DNS_SERVERS=8.8.8.8,8.8.4.4

# DNS timeout (ms)
DNS_TIMEOUT=5000

# DNS cache TTL
DNS_CACHE_TTL=300
```

## Logging and Monitoring

### Advanced Logging

Detailed logging configuration:

```bash
# Log levels per component
LOG_LEVEL_AGENT=info
LOG_LEVEL_DATABASE=debug
LOG_LEVEL_NETWORK=warn
LOG_LEVEL_SECURITY=info

# Log rotation
LOG_ROTATION_ENABLED=true
LOG_ROTATION_SIZE=100M
LOG_ROTATION_COUNT=10

# Log format
LOG_FORMAT=json
LOG_TIMESTAMP_FORMAT=ISO8601
```

### Structured Logging

Enable structured logging for analysis:

```bash
# Output format
LOG_OUTPUT_FORMAT=json

# Include stack traces
LOG_INCLUDE_STACK=true

# Correlation IDs
LOG_CORRELATION_IDS=true

# Performance metrics
LOG_PERFORMANCE_METRICS=true
```

### External Logging

Send logs to external systems:

```bash
# Syslog integration
SYSLOG_ENABLED=true
SYSLOG_HOST=syslog.company.com
SYSLOG_PORT=514
SYSLOG_PROTOCOL=tcp

# Elasticsearch integration
ELASTICSEARCH_ENABLED=true
ELASTICSEARCH_URL=https://elasticsearch.company.com:9200
ELASTICSEARCH_INDEX=cortexai-logs

# Splunk integration
SPLUNK_ENABLED=true
SPLUNK_HEC_URL=https://splunk.company.com:8088
SPLUNK_HEC_TOKEN=your-token
```

## Database Configuration

### SQLite Tuning

Advanced SQLite settings:

```bash
# Journal mode
DB_JOURNAL_MODE=WAL

# Page size (bytes)
DB_PAGE_SIZE=4096

# Cache size (pages)
DB_CACHE_SIZE=-64000

# Temp store
DB_TEMP_STORE=memory

# Locking mode
DB_LOCKING_MODE=normal

# Auto-vacuum
DB_AUTO_VACUUM=incremental
```

### Database Encryption

Enable database encryption:

```bash
# Enable encryption (requires SQLCipher)
DB_ENCRYPTION_ENABLED=true

# Encryption key (store securely!)
DB_ENCRYPTION_KEY=your-secure-key

# Key derivation iterations
DB_ENCRYPTION_ITERATIONS=256000
```

### Backup Configuration

Automated backup settings:

```bash
# Backup directory
BACKUP_DIR=./backups

# Backup schedule (cron format)
BACKUP_SCHEDULE="0 2 * * *"

# Backup retention (days)
BACKUP_RETENTION_DAYS=30

# Backup compression
BACKUP_COMPRESSION=gzip

# Remote backup location
BACKUP_REMOTE_PATH=s3://bucket/cortexai-backups
```

## Security Hardening

### API Security

Enhance API security:

```bash
# API key rotation interval (days)
API_KEY_ROTATION_DAYS=90

# Require API key in requests
REQUIRE_API_KEY=true

# Rate limiting per key
API_RATE_LIMIT_PER_KEY=100

# Block suspicious patterns
API_BLOCK_SUSPICIOUS=true
```

### Input Validation

Strict input validation:

```bash
# Maximum input length
MAX_INPUT_LENGTH=10000

# Allowed characters
INPUT_ALLOWED_CHARS=alphanumeric,punctuation

# Sanitize inputs
INPUT_SANITIZATION=strict

# Block command injection patterns
BLOCK_COMMAND_INJECTION=true
```

### Scope Enforcement

Strict scope enforcement:

```bash
# Enable strict scope checking
STRICT_SCOPE_ENFORCEMENT=true

# Require confirmation for out-of-scope
CONFIRM_OUT_OF_SCOPE=true

# Block out-of-scope attempts
BLOCK_OUT_OF_SCOPE=true

# Log scope violations
LOG_SCOPE_VIOLATIONS=true
```

## Integration Configurations

### CI/CD Integration

Configure for CI/CD pipelines:

```bash
# Headless mode
HEADLESS_MODE=true

# Non-interactive mode
NON_INTERACTIVE=true

# Exit on error
EXIT_ON_ERROR=true

# Output format
OUTPUT_FORMAT=json

# Results directory
RESULTS_DIR=./test-results
```

### API Server Mode

Run CortexAI as an API server:

```bash
# Enable API server
API_SERVER_MODE=true

# Server port
API_SERVER_PORT=3000

# Server host
API_SERVER_HOST=0.0.0.0

# Enable CORS
API_CORS_ENABLED=true
API_CORS_ORIGIN=*

# API authentication
API_AUTH_ENABLED=true
API_AUTH_TOKEN=your-api-token
```

### Webhook Integration

Configure webhook notifications:

```bash
# Enable webhooks
WEBHOOKS_ENABLED=true

# Webhook URL
WEBHOOK_URL=https://your-server.com/webhooks/cortexai

# Webhook events
WEBHOOK_EVENTS=vulnerability_found,scan_complete

# Webhook authentication
WEBHOOK_AUTH_HEADER=Authorization
WEBHOOK_AUTH_TOKEN=Bearer your-token

# Retry configuration
WEBHOOK_RETRY_ATTEMPTS=3
WEBHOOK_TIMEOUT=30
```

## Container Deployment

### Docker Configuration

Environment variables for Docker:

```bash
# Container-specific settings
CONTAINER_MODE=true
CONTAINER_PLATFORM=docker

# Volume mounts
PROJECTS_VOLUME=/data/projects
LOGS_VOLUME=/data/logs
CACHE_VOLUME=/data/cache

# User/group IDs
CONTAINER_UID=1000
CONTAINER_GID=1000
```

### Kubernetes Configuration

Kubernetes-specific settings:

```bash
# Kubernetes mode
KUBERNETES_MODE=true

# Service account
K8S_SERVICE_ACCOUNT=cortexai-sa

# Namespace
K8S_NAMESPACE=security-testing

# Resource limits
K8S_MEMORY_LIMIT=4Gi
K8S_CPU_LIMIT=2000m

# Persistent volume claims
K8S_PVC_PROJECTS=cortexai-projects-pvc
K8S_PVC_LOGS=cortexai-logs-pvc
```

## Development Configuration

### Debug Mode

Enhanced debugging:

```bash
# Enable debug mode
DEBUG_MODE=true

# Debug level (0-3)
DEBUG_LEVEL=2

# Debug output
DEBUG_OUTPUT=console,file

# Break on exceptions
DEBUG_BREAK_ON_EXCEPTION=true

# Source maps
DEBUG_SOURCE_MAPS=true
```

### Testing Configuration

Settings for testing environments:

```bash
# Test mode
TEST_MODE=true

# Mock external services
MOCK_EXTERNAL_SERVICES=true

# Test data directory
TEST_DATA_DIR=./test/data

# Test timeout
TEST_TIMEOUT=30000

# Coverage reporting
COVERAGE_ENABLED=true
COVERAGE_DIR=./coverage
```

## Custom Agent Behavior

### AI Model Fine-tuning

Adjust AI behavior:

```bash
# Temperature (0.0-2.0)
AI_TEMPERATURE=0.7

# Top P sampling
AI_TOP_P=0.9

# Frequency penalty
AI_FREQUENCY_PENALTY=0.0

# Presence penalty
AI_PRESENCE_PENALTY=0.0

# Max tokens per response
AI_MAX_TOKENS=2000

# Stop sequences
AI_STOP_SEQUENCES="\n\n,END"
```

### Custom Prompts

Override system prompts:

```bash
# Custom prompt directory
CUSTOM_PROMPTS_DIR=./config/prompts

# Prompt templates
PROMPT_TEMPLATE_RECON=custom_recon.txt
PROMPT_TEMPLATE_ANALYSIS=custom_analysis.txt
PROMPT_TEMPLATE_REPORTING=custom_reporting.txt
```

### Behavior Modifications

Modify agent behavior:

```bash
# Verbosity level
AGENT_VERBOSITY=normal

# Auto-confirm actions
AGENT_AUTO_CONFIRM=false

# Response delay (ms)
AGENT_RESPONSE_DELAY=0

# Thinking display
AGENT_SHOW_THINKING=true

# Tool execution timeout
AGENT_TOOL_TIMEOUT=300
```

## Configuration Management

### Environment Profiles

Manage multiple configurations:

```bash
# Configuration profile
CONFIG_PROFILE=production

# Profile directory
CONFIG_PROFILES_DIR=./config/profiles

# Override file
CONFIG_OVERRIDE_FILE=./config/override.env
```

### Configuration Validation

Validate configuration:

```bash
# Enable strict validation
CONFIG_STRICT_VALIDATION=true

# Required variables
CONFIG_REQUIRED_VARS=AZURE_ENDPOINT,AZURE_API_KEY

# Fail on missing variables
CONFIG_FAIL_ON_MISSING=true

# Warn on deprecated options
CONFIG_WARN_DEPRECATED=true
```

### Configuration Templates

Use configuration templates:

```bash
# Template directory
CONFIG_TEMPLATES_DIR=./config/templates

# Active template
CONFIG_ACTIVE_TEMPLATE=default

# Template variables
TEMPLATE_VAR_ENVIRONMENT=production
TEMPLATE_VAR_REGION=us-east-1
```

## Troubleshooting Advanced Configuration

### Configuration Debugging

Debug configuration issues:

```bash
# Print loaded configuration
npm start -- --print-config

# Validate configuration
npm start -- --validate-config

# Show configuration sources
npm start -- --show-config-sources
```

### Common Issues

**Performance Issues**:
- Increase memory limit
- Enable database WAL mode
- Adjust connection pool size
- Enable response caching

**Connection Problems**:
- Verify proxy settings
- Check TLS configuration
- Test DNS resolution
- Review firewall rules

**Integration Failures**:
- Validate API credentials
- Check webhook URLs
- Verify tool paths
- Test external services

## Next Steps

After advanced configuration:

1. **Performance Tuning**: [Performance Optimization](../help/performance-optimization.md)
2. **Security Hardening**: [Legal Guidelines](../legal/legal-guidelines.md)
3. **Integration**: [Tool Configuration](../tools/tool-configuration.md)

## Getting Help

For advanced configuration support:

- **Configuration Reference**: [Configuration Reference](../reference/configuration-reference.md)
- **Troubleshooting**: [Troubleshooting Guide](../help/troubleshooting.md)
- **GitHub Issues**: [Report problems](https://github.com/theelderemo/cortexai/issues)

---

**Note**: Many advanced features are optional and should only be enabled when needed. Start with defaults and adjust as required.
