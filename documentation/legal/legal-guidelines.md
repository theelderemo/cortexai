# Legal Guidelines

Legal considerations and requirements for penetration testing with CortexAI.

## Critical Legal Notice

**WARNING**: Unauthorized access to computer systems is illegal in virtually all jurisdictions. Penalties can include criminal prosecution, fines, and imprisonment. Always obtain explicit written authorization before conducting any security testing.

## Authorization Requirements

### Written Permission

**Always Required**:
- Written authorization document
- Clearly defined scope
- Specific time period
- Authorized personnel listed
- Contact information
- Escalation procedures

**Authorization Should Include**:
- Target systems and networks
- Testing methods allowed
- Prohibited actions
- Testing timeframe
- Emergency contacts
- Termination conditions

### Scope of Work

**Documented Scope Must Include**:
- In-scope IP addresses, domains, and systems
- Out-of-scope exclusions
- Permitted testing techniques
- Prohibited actions
- Rate limits and restrictions
- Data handling requirements

### Example Authorization

```
PENETRATION TESTING AUTHORIZATION

Client: Example Corporation
Tester: Security Professional / Company Name
Period: January 15, 2024 - January 30, 2024

AUTHORIZED TARGETS:
- https://webapp.example.com/*
- 192.168.1.0/24

EXCLUDED TARGETS:
- https://webapp.example.com/admin/production/*
- 192.168.1.1 (Gateway)
- 192.168.1.5 (Production Database)

AUTHORIZED METHODS:
- Web application security testing
- Network scanning
- Vulnerability assessment
- Non-destructive testing

PROHIBITED ACTIONS:
- Denial of Service testing
- Data destruction or modification
- Social engineering of employees
- Physical security testing

EMERGENCY CONTACT:
John Smith, Security Manager
Phone: +1-555-0123
Email: security@example.com

This authorization may be terminated at any time by either party.

Signed: _________________ Date: _____________
Client Representative

Signed: _________________ Date: _____________
Testing Professional
```

## Legal Frameworks

### United States

**Computer Fraud and Abuse Act (CFAA)**:
- Federal law prohibiting unauthorized access
- Penalties include fines and imprisonment
- Authorization is absolute defense
- Scope violations can be prosecuted

**State Laws**:
- Additional state computer crime laws
- May be more restrictive than federal law
- Check state-specific requirements
- Some states require additional licensing

### European Union

**General Data Protection Regulation (GDPR)**:
- Strict data protection requirements
- Personal data handling restrictions
- Data breach notification requirements
- Significant penalties for violations

**Network and Information Security Directive (NIS)**:
- Requirements for essential services
- Security incident reporting
- Risk management requirements

**National Laws**:
- EU member states have specific laws
- UK Computer Misuse Act
- German Criminal Code (StGB)
- French Code pénal

### United Kingdom

**Computer Misuse Act 1990**:
- Unauthorized access is criminal offense
- Unauthorized access with intent to commit further offenses
- Unauthorized acts causing impairment
- Penalties up to life imprisonment for serious cases

### Other Jurisdictions

**Always verify local laws**:
- Consult legal counsel
- Research specific requirements
- Understand penalties
- Ensure compliance

## Authorization Types

### Client-Authorized Testing

**Internal/External Engagements**:
- Contract-based authorization
- Scope of Work (SOW)
- Rules of Engagement (ROE)
- Legal agreement

**Requirements**:
- Signed contract
- Clear scope definition
- Liability clauses
- Insurance coverage

### Bug Bounty Programs

**Public Programs**:
- Program terms are authorization
- Must follow program rules
- Respect scope limits
- Follow disclosure timelines

**Requirements**:
- Read all program rules
- Register properly
- Follow submission process
- Maintain confidentiality

**Popular Platforms**:
- HackerOne
- Bugcrowd
- Synack
- Intigriti

### Personal/Own Systems

**Self-Testing**:
- You own the system
- You control the infrastructure
- No third-party systems involved

**Considerations**:
- Still follow best practices
- Be careful with cloud services
- Review Terms of Service
- Consider hosting provider rules

## Prohibited Activities

### Never Test Without Authorization

**Always Illegal**:
- Testing strangers' websites
- Scanning random IP addresses
- Attacking public services
- "Testing" competitors
- Unauthorized penetration testing

**Consequences**:
- Criminal prosecution
- Civil liability
- Reputation damage
- Career impact
- Financial penalties

### Destructive Actions

**Generally Prohibited Unless Explicitly Authorized**:
- Denial of Service (DoS) attacks
- Data destruction or corruption
- System crashes
- Resource exhaustion
- Production data modification

### Social Engineering

**Often Restricted or Prohibited**:
- Phishing employees
- Pretexting
- Physical intrusion
- Tailgating
- Dumpster diving

**Require Explicit Authorization**:
- Written permission
- Specific scenarios
- Employee notification
- Legal review

## Data Protection

### Handling Sensitive Data

**If You Discover Sensitive Data**:
- Don't download or exfiltrate
- Document existence only
- Notify client immediately
- Follow disclosure process
- Secure your notes

**Prohibited Actions**:
- Downloading customer databases
- Exfiltrating personal information
- Storing sensitive data locally
- Sharing data publicly
- Retaining data after engagement

### Personal Data

**GDPR and Privacy Considerations**:
- Minimize data collection
- Secure storage
- Limited retention
- Secure deletion
- Access controls

### Client Data

**Confidentiality**:
- Non-disclosure agreements
- Secure communication
- Encrypted storage
- Limited sharing
- Professional ethics

## Incident Response

### If You Cause an Issue

**Immediate Actions**:
1. Stop testing immediately
2. Contact client emergency contact
3. Document what happened
4. Assist with remediation
5. File incident report

**Communication**:
- Be honest and transparent
- Provide technical details
- Offer assistance
- Document everything
- Follow contractual procedures

### If You Find Critical Vulnerabilities

**Responsible Disclosure**:
1. Document thoroughly
2. Notify client immediately
3. Provide remediation guidance
4. Allow reasonable fix time
5. Maintain confidentiality

**Never**:
- Disclose publicly without permission
- Use findings for personal gain
- Leverage for additional access
- Share with unauthorized parties

## Compliance Considerations

### Industry Regulations

**Common Compliance Frameworks**:
- PCI DSS (Payment Card Industry)
- HIPAA (Healthcare)
- SOX (Financial)
- FISMA (Federal)
- ISO 27001

**Testing Requirements**:
- May require specific testing approaches
- Qualified tester requirements
- Documentation standards
- Reporting requirements

### Professional Standards

**Industry Guidelines**:
- OWASP Testing Guide
- PTES (Penetration Testing Execution Standard)
- OSSTMM (Open Source Security Testing Methodology Manual)
- NIST Guidelines

## Insurance and Liability

### Professional Liability Insurance

**Recommended Coverage**:
- Errors and Omissions (E&O) insurance
- Cyber liability coverage
- Professional indemnity
- Coverage amount appropriate for engagement

### Contractual Protections

**Contract Should Address**:
- Limitation of liability
- Indemnification clauses
- Insurance requirements
- Dispute resolution
- Termination conditions

## International Considerations

### Cross-Border Testing

**Complications**:
- Multiple jurisdictions
- Different legal standards
- Data transfer restrictions
- Varying authorization requirements

**Requirements**:
- Legal review in all jurisdictions
- Explicit authorization for each location
- Understanding of local laws
- Appropriate insurance coverage

### Data Sovereignty

**Consider**:
- Where data is stored
- Where testing originates
- Data transfer laws
- Cloud service locations

## Documentation

### Legal Documentation

**Maintain Records**:
- Authorization documents
- Scope definitions
- Communication logs
- Testing logs
- Findings reports
- Remediation evidence

**Retention Period**:
- Follow contractual requirements
- Consider statute of limitations
- Comply with industry standards
- Secure storage
- Proper disposal

### Audit Trail

**Evidence of Authorization**:
- Signed agreements
- Email communications
- Scope confirmations
- Meeting notes
- Change requests

## Best Practices

### Before Starting

1. **Legal Review**:
   - Have lawyer review authorization
   - Verify scope is clear
   - Ensure insurance is adequate
   - Understand restrictions

2. **Client Communication**:
   - Clarify expectations
   - Define emergency procedures
   - Establish contacts
   - Document agreements

3. **Risk Assessment**:
   - Identify potential impacts
   - Plan mitigation strategies
   - Establish safety measures
   - Define rollback procedures

### During Testing

1. **Stay in Scope**:
   - Continuously verify targets
   - Document all activities
   - Seek clarification when unsure
   - Stop if unauthorized

2. **Regular Communication**:
   - Status updates
   - Issue notifications
   - Scope questions
   - Incident reporting

3. **Professional Conduct**:
   - Ethical behavior
   - Confidentiality
   - Transparency
   - Respect boundaries

### After Testing

1. **Secure Cleanup**:
   - Remove test artifacts
   - Delete collected data
   - Secure findings
   - Return access credentials

2. **Final Documentation**:
   - Complete reports
   - Evidence packages
   - Recommendations
   - Follow-up plans

## When in Doubt

### Always Seek Clarification

**If Uncertain About**:
- Whether you have authorization
- If target is in scope
- If technique is permitted
- Any legal question

**Actions**:
- Stop testing
- Contact client
- Get written clarification
- Document decision
- Resume only with clear authorization

### Legal Counsel

**Consult Attorney For**:
- Contract review
- Authorization questions
- Liability concerns
- Compliance requirements
- Incident response

## Resources

### Legal Resources

- **Electronic Frontier Foundation (EFF)**: Digital rights information
- **ISACA**: Professional standards and guidance
- **Local Bar Association**: Legal counsel referrals
- **Industry Associations**: Specific guidance

### Professional Organizations

- **(ISC)²**: Certification and ethics
- **EC-Council**: Training and standards
- **SANS Institute**: Security training
- **OWASP**: Application security guidance

## Next Steps

Related documentation:

- **Ethical Usage**: [Ethical Usage Guidelines](ethical-usage.md)
- **Compliance**: [Compliance Guide](compliance.md)
- **Best Practices**: [Best Practices](../workflows/best-practices.md)

## Getting Help

For legal questions:

- **Consult legal counsel**: Always recommended
- **Professional associations**: Industry guidance
- **Client legal team**: Specific engagement questions

---

**FINAL WARNING**: This documentation is for informational purposes only and does not constitute legal advice. Always consult with qualified legal counsel for your specific situation. Unauthorized penetration testing is illegal and can result in serious criminal and civil penalties.
