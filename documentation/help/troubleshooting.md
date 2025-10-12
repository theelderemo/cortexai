# Troubleshooting

Common issues and solutions for CortexAI.

## Installation Issues

### Module Not Found Errors

**Symptoms**:
```
Error: Cannot find module 'xyz'
MODULE_NOT_FOUND
```

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+

# Clear npm cache
npm cache clean --force
npm install
```

### Environment Validation Failed

**Symptoms**:
```
❌ Environment validation failed
Missing required variables
```

**Solutions**:
```bash
# Check .env file exists
ls -la .env

# Verify required variables
cat .env | grep "AZURE_"

# Copy from template if missing
cp .env.example .env

# Edit with required values
nano .env
```

### Permission Errors

**Symptoms**:
```
EACCES: permission denied
```

**Solutions**:
```bash
# Linux/macOS - Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Fix project directory permissions
chmod -R 755 /path/to/cortexai

# Windows - Run as Administrator
Right-click > Run as Administrator
```

## Configuration Issues

### Azure API Connection Errors

**Symptoms**:
```
Failed to connect to Azure OpenAI
Authentication failed
401 Unauthorized
```

**Solutions**:
```bash
# Verify endpoint format
AZURE_ENDPOINT=https://your-resource.openai.azure.com/
# Must end with trailing slash

# Test API connectivity
curl -H "api-key: YOUR_KEY" "YOUR_ENDPOINT/openai/deployments?api-version=2024-12-01-preview"

# Check API key is correct
# Regenerate in Azure Portal if needed

# Verify deployment name matches
# Check in Azure OpenAI Studio
```

### Invalid API Version

**Symptoms**:
```
API version not supported
400 Bad Request
```

**Solutions**:
```bash
# Update to latest API version
AZURE_API_VERSION=2024-12-01-preview

# Check Azure documentation for current version
# https://learn.microsoft.com/azure/ai-services/openai/
```

### Rate Limiting

**Symptoms**:
```
429 Too Many Requests
Rate limit exceeded
```

**Solutions**:
```bash
# Reduce concurrent requests
API_MAX_CONCURRENT=3

# Increase request timeout
API_REQUEST_TIMEOUT=60

# Check Azure quota limits
# Increase TPM in Azure Portal if needed
```

## Project Issues

### Database Locked

**Symptoms**:
```
Error: database is locked
SQLITE_BUSY
```

**Solutions**:
```bash
# Close other instances
ps aux | grep cortexai
kill <pid>

# Check for zombie processes
ps aux | grep node

# Wait and retry
# SQLite lock usually clears in seconds

# Last resort - restart
pkill -f cortexai
npm start
```

### Project Won't Create

**Symptoms**:
```
Failed to create project
Database initialization error
```

**Solutions**:
```bash
# Check disk space
df -h

# Verify projects directory exists
mkdir -p projects

# Check permissions
ls -la projects/
chmod 755 projects/

# Try different project name
# Avoid special characters
```

### Database Corruption

**Symptoms**:
```
Database disk image is malformed
SQLITE_CORRUPT
```

**Solutions**:
```bash
# Try SQLite recovery
sqlite3 projects/Project.db ".recover" > recovered.sql
sqlite3 projects/Project-recovered.db < recovered.sql

# Restore from backup
cp backups/Project-backup.db projects/Project.db

# Check integrity
sqlite3 projects/Project.db "PRAGMA integrity_check;"
```

## Runtime Issues

### Agent Not Responding

**Symptoms**:
- Commands hang
- No response from AI
- Long delays

**Solutions**:
```bash
# Check API connectivity
curl https://your-endpoint.openai.azure.com/

# Verify API quota
# Check Azure Portal for usage

# Increase timeout
AGENT_TIMEOUT=300

# Check network connectivity
ping 8.8.8.8

# Review logs
tail -f /tmp/agent-logs.txt
```

### Terminal Formatting Issues

**Symptoms**:
- Garbled output
- Strange characters
- Broken layout

**Solutions**:
```bash
# Disable formatting
echo "AGENT_DISABLE_FORMATTING=true" >> .env

# Update terminal
# Use modern terminal emulator

# Check encoding
echo $LANG  # Should include UTF-8

# Windows - Use Windows Terminal
# Not Command Prompt
```

### Command Execution Failures

**Symptoms**:
```
Command failed to execute
Tool not found
Permission denied
```

**Solutions**:
```bash
# Verify tool is installed
which nmap
which gobuster

# Check PATH
echo $PATH

# Test command manually
nmap -version

# Check permissions
# Some tools require sudo

# Add tool to PATH if needed
export PATH=$PATH:/path/to/tool
```

## Performance Issues

### Slow Response Times

**Symptoms**:
- Long wait for AI responses
- Sluggish operation
- Timeouts

**Solutions**:
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096"

# Enable caching
ENABLE_RESPONSE_CACHE=true

# Reduce concurrent operations
API_MAX_CONCURRENT=3

# Check system resources
htop
free -h

# Optimize database
sqlite3 projects/Project.db "VACUUM;"
```

### High Memory Usage

**Symptoms**:
- System slowdown
- Out of memory errors
- Crashes

**Solutions**:
```bash
# Limit database cache
DB_CACHE_SIZE=5000

# Reduce evidence storage
# Archive old evidence

# Close unused projects
# One project at a time

# Increase system memory
# Or reduce usage
```

### Database Growing Too Large

**Symptoms**:
- Large database files
- Slow queries
- Storage issues

**Solutions**:
```bash
# Vacuum database
sqlite3 projects/Project.db "VACUUM;"

# Archive old evidence
# Export and remove old data

# Split into multiple projects
# One per engagement phase

# Compress evidence
# Use external file storage for large items
```

## Network Issues

### Proxy Problems

**Symptoms**:
```
Connection failed
Proxy authentication required
ECONNREFUSED
```

**Solutions**:
```bash
# Set proxy environment variables
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080

# With authentication
export HTTP_PROXY=http://user:pass@proxy.company.com:8080

# No proxy for local
export NO_PROXY=localhost,127.0.0.1,.local

# Configure in .env
HTTP_PROXY=http://proxy.company.com:8080
```

### Firewall Blocking

**Symptoms**:
```
Connection timeout
ETIMEDOUT
Connection refused
```

**Solutions**:
```bash
# Allow outbound HTTPS (port 443)
# Configure firewall rules

# Test connectivity
curl -I https://your-endpoint.openai.azure.com

# Check DNS resolution
nslookup your-endpoint.openai.azure.com

# Try different network
# Mobile hotspot for testing
```

### SSL/TLS Errors

**Symptoms**:
```
SSL certificate problem
UNABLE_TO_VERIFY_LEAF_SIGNATURE
```

**Solutions**:
```bash
# Update certificates
# macOS
sudo security update-trust-settings

# Linux
sudo update-ca-certificates

# Temporary workaround (not recommended)
NODE_TLS_REJECT_UNAUTHORIZED=0

# Use corporate CA if needed
TLS_CA_CERT=/path/to/ca-cert.pem
```

## Scope Issues

### Targets Not in Scope

**Symptoms**:
```
Target is out of scope
Scope validation failed
```

**Solutions**:
```
> "Show current testing scope"
> "Add https://target.example.com/* to scope"
> "Test if https://target.example.com is in scope"

# Review scope rules
# Verify authorization
# Update scope if authorized
```

### Pattern Not Matching

**Symptoms**:
- Scope rules not working
- Wrong targets blocked/allowed

**Solutions**:
```
# Test pattern
> "Test scope pattern for https://example.com/path"

# Check regex syntax
# Use URL patterns instead if simpler

# Review include/exclude order
# Excludes override includes

# Start with simple patterns
# Add complexity gradually
```

## Discovery Issues

### No Assets Discovered

**Symptoms**:
- Empty site map
- No discoveries
- Missing resources

**Solutions**:
```bash
# Verify target is accessible
curl -I https://example.com

# Check scope allows target
> "Is https://example.com in scope?"

# Try different discovery methods
> "Crawl https://example.com"
> "Discover content on https://example.com"

# Check network connectivity
ping example.com
```

### Discovery Too Slow

**Symptoms**:
- Slow crawling
- Discovery hangs
- Timeouts

**Solutions**:
```bash
# Reduce wordlist size
# Use smaller custom wordlist

# Limit recursion depth
# Focus on specific paths

# Adjust timeout
CONNECTION_TIMEOUT=30

# Use targeted discovery
> "Discover content in /admin only"
```

## Database Viewer Issues

### Viewer Won't Open

**Symptoms**:
- Database viewer fails to launch
- Browser doesn't open
- Port conflicts

**Solutions**:
```bash
# Check if port is in use
lsof -i :8080
netstat -ano | findstr 8080

# Use different port
DB_VIEWER_PORT=8081

# Open manually
# Get URL from logs
# Open in browser

# Check browser is installed
which firefox
which chrome
```

### Viewer Shows No Data

**Symptoms**:
- Empty tables
- No project data visible

**Solutions**:
```bash
# Verify database file exists
ls -la projects/*.db

# Check database isn't empty
sqlite3 projects/Project.db "SELECT COUNT(*) FROM sites;"

# Refresh browser
# Clear cache

# Check project is loaded
> "Show project status"
```

## Getting More Help

### Log Files

Check logs for detailed error information:

```bash
# Agent logs
tail -f /tmp/agent-logs.txt

# System logs (Linux)
tail -f /var/log/syslog

# Windows Event Viewer
eventvwr.msc
```

### Debug Mode

Enable debug mode for more information:

```bash
# Set debug mode
DEBUG_MODE=true
LOG_LEVEL=debug

# Restart CortexAI
npm start
```

### Common Error Codes

**ECONNREFUSED**: Connection refused - check service is running
**ENOTFOUND**: DNS resolution failed - check hostname
**ETIMEDOUT**: Connection timeout - check network/firewall
**EACCES**: Permission denied - check file permissions
**SQLITE_BUSY**: Database locked - close other instances
**401**: Authentication failed - check API key
**429**: Rate limited - reduce request rate
**500**: Server error - check Azure service status

## Reporting Issues

### Before Reporting

1. Check this troubleshooting guide
2. Review FAQ
3. Search existing issues
4. Try basic troubleshooting steps
5. Gather diagnostic information

### Issue Report Template

```
**Environment**:
- OS: [e.g., Ubuntu 22.04]
- Node.js version: [e.g., 20.0.0]
- CortexAI version: [e.g., commit hash]

**Problem Description**:
Clear description of the issue

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Error Messages**:
```
Paste error messages here
```

**Logs**:
```
Relevant log entries
```

**Additional Context**:
Any other relevant information
```

## Next Steps

If issues persist:

- **FAQ**: [Frequently Asked Questions](faq.md)
- **Error Messages**: [Error Messages Guide](error-messages.md)
- **Performance**: [Performance Optimization](performance-optimization.md)
- **GitHub Issues**: [Report a Bug](https://github.com/theelderemo/cortexai/issues)

---

**Remember**: Most issues can be resolved by checking configuration, verifying permissions, and ensuring all dependencies are installed correctly.
