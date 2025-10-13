# Security Policy

## Supported Versions

CortexAI follows semantic versioning and maintains security support for the following versions:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 1.3.x   | :white_check_mark: | Current stable release |
| 1.2.x   | :white_check_mark: | Security fixes only |
| 0.x.x   | :x:                | Development versions - not supported |

**Note**: Given CortexAI's nature as a security testing tool, I prioritize rapid security updates. Only the latest minor version receives feature updates, while the previous minor version receives critical security patches for 6 months after the next minor release.

## Reporting a Vulnerability

### How to Report

**For security vulnerabilities in CortexAI itself**, please report responsibly:

1. **Email**: Send details to `chris.dickinson@mailfence.com` with subject line: `[SECURITY] CortexAI Vulnerability Report` and ensure you are using a PGP key
2. **GitHub Security Advisories**: Use GitHub's [private vulnerability reporting](https://github.com/theelderemo/cortexai/security/advisories) feature
3. **Do NOT** create public GitHub issues for security vulnerabilities

### PGP Encryption

For sensitive vulnerability reports, please use PGP encryption:

- **PGP Key**: 0xBAE74ED3A768A498
- **Fingerprint**: 2D4BAA9AD587A636050F5456BAE74ED3A768A498
- **Key Server**: [OpenPGP](https://keys.openpgp.org/)

You can also find the public key at: `https://github.com/theelderemo.gpg`

### What to Include

Please provide:
- **Description**: Clear description of the vulnerability
- **Impact**: Potential security impact and affected components
- **Reproduction**: Step-by-step instructions to reproduce
- **Environment**: CortexAI version, Node.js version, operating system
- **Proof of Concept**: Code or screenshots demonstrating the issue
- **Suggested Fix**: If you have ideas for remediation

### Response Timeline

- **Initial Response**: Within 24-48 hours acknowledging receipt
- **Assessment**: Within 5 business days - vulnerability assessment and severity classification
- **Fix Timeline**: 
  - **Critical**: 1-3 days
  - **High**: 1-2 weeks  
  - **Medium**: 2-4 weeks
  - **Low**: Next planned release
- **Disclosure**: Coordinated disclosure after fix is available

### What to Expect

**If Accepted**:
- I'll work with you on a fix and coordinate disclosure
- You'll be credited in release notes (unless you prefer anonymity)
- I may offer a token of appreciation for significant findings

**If Declined**:
- I'll provide clear reasoning why it's not considered a security issue
- You're free to disclose publicly after my assessment
- I may suggest alternative improvement channels (feature requests, etc.)

## Security Considerations for Users

### CortexAI-Specific Security Notes

Given that CortexAI is a penetration testing tool:

1. **Authorized Use Only**: CortexAI should only be used against systems you own or have explicit permission to test
2. **Data Sensitivity**: Project databases may contain sensitive vulnerability data - secure them appropriately
3. **API Keys**: Protect your Azure OpenAI API keys and rotate them regularly
4. **Network Isolation**: Consider running CortexAI in isolated environments for sensitive assessments
5. **Log Security**: Audit logs may contain sensitive information - handle with appropriate data retention policies

### Responsible Disclosure for Vulnerabilities Found Using CortexAI

If you discover vulnerabilities in other systems while using CortexAI:

1. **Follow Responsible Disclosure**: Report to the affected organization first
2. **Don't Exploit**: Only perform testing within authorized scope
3. **Document Properly**: Use CortexAI's evidence collection features responsibly
4. **Respect Timelines**: Allow reasonable time for fixes before any public disclosure

## Security Best Practices

### For CortexAI Users

- Keep CortexAI updated to the latest supported version
- Use strong, unique API keys for Azure OpenAI
- Regularly backup and encrypt project databases
- Run CortexAI with minimal necessary privileges
- Monitor logs for unusual activity

### For Contributors

- Follow secure coding practices
- Validate all user inputs
- Use parameterized queries for database operations
- Implement proper error handling without information leakage
- Include security considerations in pull request descriptions

## Hall of Fame

I recognize security researchers who help improve CortexAI's security:

*This section will be updated as I receive and address security reports.*

---

**Remember**: CortexAI is designed to help identify security vulnerabilities. Please use it responsibly and ethically, with proper authorization, and follow all applicable laws and regulations.
