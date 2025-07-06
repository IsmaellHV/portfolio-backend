# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our software seriously. If you believe you have found a security vulnerability in our portfolio backend, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them to us directly via email at [ismaelhv@outlook.com](mailto:ismaelhv@outlook.com).

Please include the following information in your report:

- **Type of issue** (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- **Full paths of source file(s) related to the manifestation of the issue**
- **The location of the affected source code** (tag/branch/commit or direct URL)
- **Any special configuration required to reproduce the issue**
- **Step-by-step instructions to reproduce the issue**
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

### Response Timeline

- **Initial Response**: We will acknowledge receipt of your vulnerability report within 48 hours.
- **Status Updates**: We will send you regular updates about our progress every 7 days.
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days of the initial report.

### What to Expect

After you submit a report, here's what you can expect:

1. **Acknowledgment**: We'll confirm that we've received your report and provide you with a tracking number.
2. **Investigation**: Our security team will investigate the issue and may reach out for additional information.
3. **Resolution**: We'll work to fix the vulnerability and will keep you informed of our progress.
4. **Disclosure**: Once the issue is resolved, we may publicly disclose the vulnerability (with your consent).

## Security Best Practices

This project implements several security measures:

- **Input Validation**: All user inputs are validated using AJV schemas
- **Authentication**: JWT-based authentication for protected endpoints
- **Authorization**: Role-based access control for different user types
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for setting various HTTP headers
- **CORS**: Proper Cross-Origin Resource Sharing configuration
- **Environment Variables**: Sensitive data is stored in environment variables
- **Dependencies**: Regular updates and security audits of dependencies

## Responsible Disclosure

We appreciate the security research community's efforts to help keep our users safe. If you discover a security vulnerability, we encourage responsible disclosure by:

1. Giving us reasonable time to investigate and fix the issue before public disclosure
2. Not accessing or modifying data that doesn't belong to you
3. Not degrading the service for other users
4. Not using the vulnerability for anything other than verification

## Recognition

We believe in recognizing security researchers who help us improve our security. If you report a valid vulnerability, we will:

- Acknowledge your contribution (with your permission)
- Keep you informed about the progress of fixing the issue
- Credit you in our security advisories (if desired)

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## Contact Information

For any security-related questions or concerns, please contact:

- **Email**: [ismaelhv@outlook.com](mailto:ismaelhv@outlook.com)
- **Subject Line**: [SECURITY] Portfolio Backend - [Brief Description]

---

Thank you for helping keep our project and our users safe!
