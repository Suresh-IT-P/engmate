const path = require('path');
const dotenv = require('dotenv');

// Load .env from backend or root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  
  // Database Configuration
  db: {
    client: process.env.DB_CLIENT || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    database: process.env.DB_NAME || 'englishmate',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('aivencloud.com')
  },
  
  // Authentication
  //
  // The old fallback was a literal string committed to this repo, so any
  // deployment that forgot to set JWT_SECRET signed tokens with a key the whole
  // world can read — enough to forge a session for any user, admin included.
  // Development keeps a throwaway default; production refuses to start.
  jwtSecret: process.env.JWT_SECRET || 'englishmate-local-dev-only-not-for-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // AI Service Configuration
  ai: {
    provider: process.env.AI_PROVIDER || 'gemini', // 'gemini', 'openai', 'anthropic', 'rule_engine'
    apiKey: process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '',
    model: process.env.AI_MODEL || 'gemini-1.5-flash',
  },
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

/**
 * Fail loudly at boot rather than quietly running a production deployment with
 * a known-public signing key.
 */
const WEAK_SECRETS = new Set([
  'englishmate-ai-bridge-super-secret-jwt-key-2026',
  'englishmate_super_secret_production_jwt_key_2026_change_in_prod',
  'englishmate-local-dev-only-not-for-production',
  'replace-me-with-a-long-random-string',
  'secret',
  'changeme'
]);

if (config.env === 'production') {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      'JWT_SECRET is not set. Refusing to start in production with a default ' +
      'signing key. Generate one with:\n' +
      '  node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"'
    );
  }
  if (WEAK_SECRETS.has(process.env.JWT_SECRET) || process.env.JWT_SECRET.length < 32) {
    throw new Error(
      'JWT_SECRET is a known-public or too-short value. Rotate it to a long ' +
      'random string before deploying.'
    );
  }
}

module.exports = config;
