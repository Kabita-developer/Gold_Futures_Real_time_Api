// Gold Futures Real-time API Server
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const cron = require('node-cron');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import configurations and middleware
const config = require('./config/env');
const routes = require('./routes');
const { logRequest, logError, performanceMonitor } = require('./middleware/logging');
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');
const goldDataService = require('./services/GoldDataService');

// WebSocket Configuration
const WS_PORT = process.env.WS_PORT || 8081;
const wss = new WebSocket.Server({ port: WS_PORT });

// Create Express app
const app = express();

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Logging middleware
app.use(logRequest);
app.use(performanceMonitor);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gold Futures Real-time API',
      version: '1.0.0',
      description: 'A comprehensive API for real-time gold futures data with WebSocket support',
      contact: {
        name: 'Gold Futures API Team',
        email: 'support@goldfuturesapi.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        GoldPrice: {
          type: 'object',
          properties: {
            symbol: {
              type: 'string',
              enum: ['GC', 'XAUUSD', 'GOLD', 'GLD'],
              description: 'Gold symbol'
            },
            price: {
              type: 'number',
              description: 'Current price'
            },
            change: {
              type: 'number',
              description: 'Price change'
            },
            changePercent: {
              type: 'number',
              description: 'Price change percentage'
            },
            high: {
              type: 'number',
              description: 'Highest price'
            },
            low: {
              type: 'number',
              description: 'Lowest price'
            },
            open: {
              type: 'number',
              description: 'Opening price'
            },
            previousClose: {
              type: 'number',
              description: 'Previous closing price'
            },
            volume: {
              type: 'number',
              description: 'Trading volume'
            },
            source: {
              type: 'string',
              enum: ['Alpha Vantage', 'Finnhub', 'IEX Cloud', 'Quandl'],
              description: 'Data source'
            },
            lastUpdate: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Request success status'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            error: {
              type: 'string',
              description: 'Error message if any'
            },
            cached: {
              type: 'boolean',
              description: 'Whether data is cached'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/', routes);
app.use('/api/v1/gold', require('./routes/gold'));

// WebSocket server (using WS_PORT defined above)

wss.on('connection', (ws, req) => {
  console.log('🔌 New WebSocket connection');
  
  // Send current data immediately or fetch fresh data
  const sendGoldData = async () => {
    try {
      let currentData = goldDataService.getCachedData('XAUUSD');
      
      if (!currentData) {
        // If no cached data, fetch fresh data
        currentData = await goldDataService.getGoldData('XAUUSD');
        goldDataService.setCachedData('XAUUSD', currentData);
      }
      
      ws.send(JSON.stringify({
        type: 'gold_data',
        data: currentData,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error sending gold data:', error);
    }
  };

  // Send initial data
  sendGoldData();

  // Send periodic updates
  const interval = setInterval(async () => {
    try {
      const data = goldDataService.getCachedData('XAUUSD');
      if (data) {
        ws.send(JSON.stringify({
          type: 'gold_data',
          data: data,
          timestamp: new Date().toISOString()
        }));
      } else {
        // If no cached data, fetch fresh data
        const freshData = await goldDataService.getGoldData('XAUUSD');
        goldDataService.setCachedData('XAUUSD', freshData);
        ws.send(JSON.stringify({
          type: 'gold_data',
          data: freshData,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Error in WebSocket interval:', error);
    }
  }, config.GOLD_DATA_REFRESH_INTERVAL);

  ws.on('close', () => {
    console.log('🔌 WebSocket connection closed');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Data refresh cron job
cron.schedule('*/30 * * * * *', async () => {
  try {
    console.log('🔄 Refreshing gold data...');
    await goldDataService.getGoldData('XAUUSD');
    console.log('✅ Gold data refreshed');
  } catch (error) {
    console.error('❌ Failed to refresh gold data:', error.message);
  }
});

// Error handling middleware
app.use(logError);
app.use(notFound);
app.use(globalErrorHandler);

// Start server
const server = app.listen(config.PORT, () => {
  console.log('\n🚀 Gold Futures Real-time API Server');
  console.log('=====================================');
  console.log(`🌐 Server running on port ${config.PORT}`);
  console.log(`📊 WebSocket server on port ${config.WS_PORT}`);
  console.log(`📚 API Documentation: http://localhost:${config.PORT}/api-docs`);
  console.log(`🔗 API Base URL: http://localhost:${config.PORT}/api/v1`);
  console.log(`💡 WebSocket URL: ws://localhost:${config.WS_PORT}`);
  console.log('=====================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

module.exports = app;
