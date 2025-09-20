# Solution for "Cannot find module 'express'" Error

## Problem
The error occurs because the npm dependencies are not being installed properly, causing the `require('express')` statement to fail.

## Solutions

### Option 1: Manual Installation (Recommended)
Run these commands one by one in your terminal:

```bash
# Navigate to your project directory
cd C:\Users\kabit\OneDrive\Desktop\GOLD_FUTURES_REAL_TIME

# Clear npm cache
npm cache clean --force

# Delete node_modules if it exists
rmdir /s /q node_modules

# Delete package-lock.json if it exists
del package-lock.json

# Install dependencies
npm install express
npm install mongoose
npm install axios
npm install cors
npm install helmet
npm install express-rate-limit
npm install node-cron
npm install ws
npm install express-validator
npm install dotenv
npm install winston
npm install swagger-jsdoc
npm install swagger-ui-express
npm install nodemon --save-dev
```

### Option 2: Use the Minimal Server
I've created a `minimal-server.js` that works without external dependencies:

```bash
node minimal-server.js
```

This provides basic API functionality without requiring npm packages.

### Option 3: Fix Package.json and Reinstall
1. Make sure your `package.json` is correct
2. Run: `npm install --force`
3. If that doesn't work, try: `npm install --legacy-peer-deps`

### Option 4: Use Yarn Instead
If npm continues to have issues:

```bash
# Install yarn globally
npm install -g yarn

# Install dependencies with yarn
yarn install

# Start the server
yarn dev
```

## Verification
After installing dependencies, test with:

```bash
# Test if express is available
node -e "console.log(require('express'))"

# Start the server
npm run dev
```

## Alternative: Use the Minimal Server
If you continue having issues with npm, use the `minimal-server.js` file which provides:

- ✅ Health check endpoint
- ✅ Current gold price endpoint
- ✅ Symbols endpoint
- ✅ Historical data endpoint
- ✅ CORS support
- ✅ JSON responses
- ✅ No external dependencies

## Quick Start with Minimal Server
```bash
node minimal-server.js
```

Then test:
- http://localhost:3000/api/v1/gold/health
- http://localhost:3000/api/v1/gold/current
- http://localhost:3000/api/v1/gold/symbols
- http://localhost:3000/api/v1/gold/historical/XAUUSD?days=7
```

## Root Cause
The issue is likely due to:
1. npm cache corruption
2. Permission issues
3. Network connectivity problems
4. Node.js/npm version conflicts

The minimal server bypasses these issues by using only built-in Node.js modules.
