// Minimal Gold Futures API Server (No external dependencies)
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// In-memory cache for gold data
let goldDataCache = {
  lastUpdated: null,
  data: null
};

// Mock gold data (replace with real API calls)
const mockGoldData = {
  'XAUUSD': {
    symbol: 'XAUUSD',
    price: 2045.50,
    change: 12.30,
    changePercent: 0.60,
    lastUpdate: new Date().toISOString(),
    source: 'Mock Data'
  },
  'GC': {
    symbol: 'GC',
    price: 2045.50,
    change: 12.30,
    changePercent: 0.60,
    high: 2050.00,
    low: 2035.00,
    open: 2040.00,
    previousClose: 2033.20,
    lastUpdate: new Date().toISOString(),
    source: 'Mock Data'
  }
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Helper function to send JSON response
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, corsHeaders);
  res.end(JSON.stringify(data, null, 2));
};

// Helper function to parse query parameters
const parseQuery = (queryString) => {
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key && value) {
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
  }
  return params;
};

// Route handlers
const routes = {
  '/': (req, res) => {
    sendJSON(res, 200, {
      success: true,
      message: 'Gold Futures Real-time API',
      version: '1.0.0',
      endpoints: {
        health: '/api/v1/gold/health',
        current: '/api/v1/gold/current',
        symbols: '/api/v1/gold/symbols',
        historical: '/api/v1/gold/historical/:symbol'
      },
      timestamp: new Date().toISOString()
    });
  },

  '/api/v1/gold/health': (req, res) => {
    sendJSON(res, 200, {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: 'development'
    });
  },

  '/api/v1/gold/current': (req, res) => {
    const urlParts = url.parse(req.url, true);
    const symbol = urlParts.query.symbol || 'XAUUSD';
    
    const data = mockGoldData[symbol] || mockGoldData['XAUUSD'];
    
    sendJSON(res, 200, {
      success: true,
      data: data,
      cached: false
    });
  },

  '/api/v1/gold/symbols': (req, res) => {
    sendJSON(res, 200, {
      success: true,
      symbols: {
        'GC': 'Gold Futures (COMEX)',
        'XAUUSD': 'Gold Spot Price (USD)',
        'GOLD': 'Gold ETF',
        'GLD': 'SPDR Gold Trust'
      }
    });
  },

  '/api/v1/gold/historical/XAUUSD': (req, res) => {
    const urlParts = url.parse(req.url, true);
    const days = parseInt(urlParts.query.days) || 7;
    
    // Generate mock historical data
    const historicalData = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const basePrice = 2040 + Math.random() * 20;
      historicalData.push({
        date: date.toISOString().split('T')[0],
        open: basePrice,
        high: basePrice + Math.random() * 10,
        low: basePrice - Math.random() * 10,
        close: basePrice + (Math.random() - 0.5) * 5
      });
    }
    
    sendJSON(res, 200, {
      success: true,
      data: historicalData,
      symbol: 'XAUUSD',
      days: days
    });
  }
};

// Main server handler
const server = http.createServer((req, res) => {
  const urlParts = url.parse(req.url, true);
  const pathname = urlParts.pathname;
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }
  
  // Route matching
  if (routes[pathname]) {
    routes[pathname](req, res);
  } else if (pathname.startsWith('/api/v1/gold/')) {
    // Handle dynamic routes
    if (pathname.startsWith('/api/v1/gold/historical/')) {
      routes['/api/v1/gold/historical/XAUUSD'](req, res);
    } else {
      sendJSON(res, 404, {
        success: false,
        error: 'Endpoint not found'
      });
    }
  } else {
    sendJSON(res, 404, {
      success: false,
      error: 'API endpoint not found'
    });
  }
});

// Start server
server.listen(PORT, () => {
  console.log('\n🚀 Gold Futures Real-time API Server (Minimal Version)');
  console.log('====================================================');
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`📈 Available endpoints:`);
  console.log(`   GET /api/v1/gold/health - Health check`);
  console.log(`   GET /api/v1/gold/current - Current gold price`);
  console.log(`   GET /api/v1/gold/symbols - Available symbols`);
  console.log(`   GET /api/v1/gold/historical/XAUUSD - Historical data`);
  console.log('====================================================\n');
  console.log('💡 This is a minimal version without external dependencies.');
  console.log('   For full functionality, install dependencies with: npm install\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = server;
