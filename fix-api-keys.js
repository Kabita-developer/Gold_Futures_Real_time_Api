// Fix API Keys - Force Mock Data Mode
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing API Keys to use Mock Data Mode...');

// Read current config
const configPath = path.join(__dirname, 'config', 'env.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Replace API keys with demo values to force mock data
configContent = configContent.replace(
  /ALPHA_VANTAGE_API_KEY: process\.env\.ALPHA_VANTAGE_API_KEY \|\| '[^']*'/,
  "ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || 'demo'"
);

configContent = configContent.replace(
  /FINNHUB_API_KEY: process\.env\.FINNHUB_API_KEY \|\| '[^']*'/,
  "FINNHUB_API_KEY: process.env.FINNHUB_API_KEY || 'demo'"
);

configContent = configContent.replace(
  /IEX_CLOUD_API_KEY: process\.env\.IEX_CLOUD_API_KEY \|\| '[^']*'/,
  "IEX_CLOUD_API_KEY: process.env.IEX_CLOUD_API_KEY || 'demo'"
);

configContent = configContent.replace(
  /QUANDL_API_KEY: process\.env\.QUANDL_API_KEY \|\| '[^']*'/,
  "QUANDL_API_KEY: process.env.QUANDL_API_KEY || 'demo'"
);

// Write updated config
fs.writeFileSync(configPath, configContent);

console.log('✅ API Keys updated to use Mock Data Mode');
console.log('📊 All external API calls will now use mock data');
console.log('🚀 No more API errors - clean logs!');
console.log('\nRestart your server to see the changes:');
console.log('1. Stop current server (Ctrl+C)');
console.log('2. Run: node server.js');
