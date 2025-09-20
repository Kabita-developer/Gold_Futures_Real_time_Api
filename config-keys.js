// Add your real API keys here
// Copy this file to config/env.js and replace 'demo' with your actual keys

module.exports = {
  // Server Configuration
  PORT: 4000,
  NODE_ENV: 'development',
  
  // API Keys - Replace 'demo' with your actual keys
  ALPHA_VANTAGE_API_KEY: 'YOUR_ALPHA_VANTAGE_KEY_HERE', // Get from: https://www.alphavantage.co/support/#api-key
  FINNHUB_API_KEY: 'YOUR_FINNHUB_KEY_HERE', // Get from: https://finnhub.io/register
  IEX_CLOUD_API_KEY: 'YOUR_IEX_CLOUD_KEY_HERE', // Get from: https://iexcloud.io/cloud-login#/register/
  QUANDL_API_KEY: 'YOUR_QUANDL_KEY_HERE', // Get from: https://www.quandl.com/account/api
  
  // Database Configuration
  MONGODB_URI: 'mongodb://localhost:27017/gold_futures_api',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 60000,
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // Cache Configuration
  CACHE_DURATION: 60000,
  GOLD_DATA_REFRESH_INTERVAL: 30000,
  
  // WebSocket Configuration
  WS_PORT: 4001,
  
  // Logging
  LOG_LEVEL: 'info',
  LOG_FILE: 'logs/app.log',
  
  // Security
  JWT_SECRET: 'your_jwt_secret_key_here_change_this_in_production',
  API_VERSION: 'v1',
  
  // External API Timeouts
  API_TIMEOUT: 10000,
  MAX_RETRIES: 3
};
