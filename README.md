# Gold Futures Real-time API

A comprehensive REST API and WebSocket service for fetching real-time gold futures data with MVC architecture, comprehensive documentation, and multiple data source integration.

## 🏗️ Architecture

This project follows a clean MVC (Model-View-Controller) architecture:

```
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middleware/       # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── docs/            # API documentation
├── logs/            # Application logs
└── public/          # Static files
```

## 🚀 Features

- **Real-time Gold Data**: Get current gold prices and futures data
- **Multiple Data Sources**: Alpha Vantage, Finnhub, and IEX Cloud integration
- **WebSocket Support**: Real-time updates via WebSocket connection
- **Historical Data**: Fetch historical gold price data
- **Rate Limiting**: Built-in rate limiting for API protection
- **Caching**: Intelligent caching to reduce API calls
- **Database Storage**: MongoDB integration for data persistence
- **Comprehensive Logging**: Winston-based logging system
- **API Documentation**: Swagger/OpenAPI documentation
- **Error Handling**: Centralized error handling
- **Validation**: Request validation with express-validator
- **Health Checks**: System health monitoring

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd gold_futures_real_time
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual API keys
nano .env
```

4. **Start MongoDB** (if using local database)
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using local MongoDB installation
mongod
```

5. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# API Keys - Replace with your actual API keys
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
FINNHUB_API_KEY=your_finnhub_api_key
IEX_CLOUD_API_KEY=your_iex_cloud_api_key
QUANDL_API_KEY=your_quandl_api_key

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/gold_futures_api

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration
CACHE_DURATION=60000
GOLD_DATA_REFRESH_INTERVAL=30000

# WebSocket Configuration
WS_PORT=8080

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Security
JWT_SECRET=your_jwt_secret_key_here
API_VERSION=v1

# External API Timeouts
API_TIMEOUT=10000
MAX_RETRIES=3
```

## 🔑 API Keys Setup

### Alpha Vantage
- Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
- Sign up for a free API key
- Add it to your `.env` file

### Finnhub
- Visit [Finnhub](https://finnhub.io/register)
- Get your free API key
- Add it to your `.env` file

### IEX Cloud
- Visit [IEX Cloud](https://iexcloud.io/pricing/)
- Sign up for a free tier
- Get your API token
- Add it to your `.env` file

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Health Check
```http
GET /gold/health
GET /gold/health/detailed
GET /gold/health/api
```

### Gold Price Data
```http
GET /gold/current?symbol=XAUUSD
GET /gold/:symbol
GET /gold/symbols
```

### Historical Data
```http
GET /gold/historical/:symbol?days=30
GET /gold/db/historical/:symbol?days=30
```

### Database Queries
```http
GET /gold/db/:symbol?limit=10
GET /gold/stats/:symbol?days=30
```

### Utility
```http
DELETE /gold/cache
```

## 🔌 WebSocket API

Connect to `ws://localhost:8080` for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected to Gold Futures WebSocket');
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  if (message.type === 'gold_data') {
    console.log('Gold Price:', message.data.price);
  }
});
```

## 📊 Supported Symbols

| Symbol | Description |
|--------|-------------|
| `GC` | Gold Futures (COMEX) |
| `XAUUSD` | Gold Spot Price (USD) |
| `GOLD` | Gold ETF |
| `GLD` | SPDR Gold Trust |

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon

# Production
npm start           # Start production server

# Testing
npm test            # Run API tests
npm run client      # Run client example

# Documentation
npm run docs        # Generate API documentation
```

## 📚 API Documentation

### Swagger UI
Visit `http://localhost:3000/api-docs` for interactive API documentation.

### Manual Documentation
See `docs/API.md` for comprehensive API documentation.

## 🗄️ Database Models

### GoldPrice
- Stores real-time gold price data
- Indexed by symbol, timestamp, and source
- Automatic data validation

### HistoricalData
- Stores historical OHLCV data
- Indexed by symbol, date, and source
- Price validation and statistics

### ApiLog
- Tracks API requests and responses
- Performance monitoring
- Error logging

## 🔧 Middleware

### Validation Middleware
- Request parameter validation
- Data type checking
- Custom validation rules

### Logging Middleware
- Request/response logging
- Performance monitoring
- Error tracking

### Error Handling
- Centralized error handling
- Custom error classes
- Graceful error responses

## 📈 Monitoring

### Health Checks
- System health monitoring
- Database connection status
- Memory and CPU usage
- API performance metrics

### Logging
- Winston-based logging
- Multiple log levels
- File and console output
- Structured logging

## 🚀 Deployment

### Using PM2
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name gold-api

# Monitor
pm2 monit
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
```bash
# Set production environment
export NODE_ENV=production
export MONGODB_URI=mongodb://your-mongodb-uri
export ALPHA_VANTAGE_API_KEY=your-key
# ... other environment variables
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Manual Testing
```bash
# Start server
npm run dev

# In another terminal
npm run client
```

## 📝 Usage Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

// Get current gold price
const response = await axios.get('http://localhost:3000/api/v1/gold/current');
console.log('Gold Price:', response.data.data.price);

// Get historical data
const historical = await axios.get('http://localhost:3000/api/v1/gold/historical/XAUUSD?days=7');
console.log('7-day history:', historical.data.data);
```

### Python
```python
import requests

# Get current gold price
response = requests.get('http://localhost:3000/api/v1/gold/current')
data = response.json()
print(f"Gold Price: ${data['data']['price']}")

# Get historical data
historical = requests.get('http://localhost:3000/api/v1/gold/historical/XAUUSD?days=7')
print(f"7-day history: {historical.json()['data']}")
```

### cURL
```bash
# Get current gold price
curl http://localhost:3000/api/v1/gold/current

# Get gold futures data
curl http://localhost:3000/api/v1/gold/GC

# Get historical data
curl "http://localhost:3000/api/v1/gold/historical/XAUUSD?days=30"
```

## 🔒 Security

- **Rate Limiting**: 100 requests per minute per IP
- **Input Validation**: All inputs are validated
- **Error Handling**: No sensitive information in error messages
- **CORS**: Configurable CORS settings
- **Helmet**: Security headers

## 📊 Performance

- **Caching**: 60-second cache for API responses
- **Database Indexing**: Optimized database queries
- **Connection Pooling**: Efficient database connections
- **Compression**: Response compression
- **Monitoring**: Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
1. Check the [API Documentation](docs/API.md)
2. Check the health endpoints
3. Verify your API keys are correct
4. Check the server logs
5. Ensure you're within rate limits

## 📞 Contact

- **Email**: support@goldfuturesapi.com
- **GitHub**: [@goldfuturesapi](https://github.com/goldfuturesapi)
- **Documentation**: [API Docs](docs/API.md)

---

**Happy Trading! 📈💰**

*Built with ❤️ using Node.js, Express, MongoDB, and WebSocket*
