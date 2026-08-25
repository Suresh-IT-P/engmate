# Security Architecture & Best Practices — English Mate

## 1. Security Safeguards Implemented

1. **Helmet HTTP Headers**: Sets standard secure headers preventing clickjacking, MIME sniffing, and cross-site scripting vulnerabilities.
2. **CORS Configuration**: Configurable origin controls.
3. **Password Security**: Bcrypt with salt factor 10. Passwords are never stored in plain text.
4. **JWT Authentication**: Signed with HS256 algorithm and configurable expiration (`7d`).
5. **Role-Based Access Control (RBAC)**: Middleware enforcement for `user`, `teacher`, and `admin` roles.
6. **SQL Injection Prevention**: Parameterized queries and prepared statements used for 100% of database interactions.
7. **Zero Frontend Secret Exposure**: Database credentials, JWT secrets, and AI API keys are restricted exclusively to the backend runtime environment.
8. **Rate Limiting**: Defends API endpoints against brute force and Denial of Service (DoS) attacks.
9. **Centralized Error Handling**: Suppresses raw stack traces in production responses while logging structured diagnostics to backend logs.
