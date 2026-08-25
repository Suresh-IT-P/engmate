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
  jwtSecret: process.env.JWT_SECRET || 'englishmate-ai-bridge-super-secret-jwt-key-2026',
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

module.exports = config;
