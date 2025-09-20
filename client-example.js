// Gold Futures API Client Example
const axios = require('axios');
const WebSocket = require('ws');

const API_BASE_URL = 'http://localhost:3000/api/v1';
const WS_URL = 'ws://localhost:8080';

class GoldFuturesClient {
  constructor() {
    this.apiBaseUrl = API_BASE_URL;
  }

  // Get current gold price
  async getCurrentPrice(symbol = 'XAUUSD') {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/gold/current`, {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current price:', error.message);
      throw error;
    }
  }

  // Get gold price by symbol
  async getPriceBySymbol(symbol) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/gold/${symbol}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Get historical data
  async getHistoricalData(symbol = 'XAUUSD', days = 30) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/gold/historical/${symbol}`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error.message);
      throw error;
    }
  }

  // Get available symbols
  async getSymbols() {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/gold/symbols`);
      return response.data;
    } catch (error) {
      console.error('Error fetching symbols:', error.message);
      throw error;
    }
  }

  // Check API health
  async checkHealth() {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/gold/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error.message);
      throw error;
    }
  }

  // Connect to WebSocket for real-time updates
  connectWebSocket() {
    const ws = new WebSocket(WS_URL);

    ws.on('open', () => {
      console.log('🔌 Connected to Gold Futures WebSocket');
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        if (message.type === 'gold_data') {
          console.log('\n📊 Real-time Gold Data:');
          console.log(`💰 Symbol: ${message.data.symbol}`);
          console.log(`💵 Price: $${message.data.price}`);
          console.log(`📈 Change: ${message.data.change > 0 ? '+' : ''}${message.data.change}`);
          console.log(`📊 Change %: ${message.data.changePercent > 0 ? '+' : ''}${message.data.changePercent}%`);
          console.log(`🕐 Last Update: ${message.data.lastUpdate}`);
          console.log(`🔗 Source: ${message.data.source}`);
          console.log('─'.repeat(50));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error.message);
      }
    });

    ws.on('close', () => {
      console.log('🔌 WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error.message);
    });

    return ws;
  }
}

// Example usage
async function runExamples() {
  const client = new GoldFuturesClient();

  try {
    console.log('🚀 Gold Futures API Client Examples\n');

    // Check API health
    console.log('1. Checking API health...');
    const health = await client.checkHealth();
    console.log('✅ API Status:', health.status);
    console.log('⏰ Uptime:', Math.round(health.uptime), 'seconds\n');

    // Get available symbols
    console.log('2. Getting available symbols...');
    const symbols = await client.getSymbols();
    console.log('📋 Available symbols:');
    Object.entries(symbols.symbols).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    console.log('');

    // Get current gold price
    console.log('3. Getting current gold price...');
    const currentPrice = await client.getCurrentPrice('XAUUSD');
    if (currentPrice.success) {
      console.log('💰 Current Gold Price (XAUUSD):');
      console.log(`   Price: $${currentPrice.data.price}`);
      console.log(`   Change: ${currentPrice.data.change > 0 ? '+' : ''}${currentPrice.data.change}`);
      console.log(`   Change %: ${currentPrice.data.changePercent > 0 ? '+' : ''}${currentPrice.data.changePercent}%`);
      console.log(`   Source: ${currentPrice.data.source}`);
      console.log(`   Cached: ${currentPrice.cached}`);
    }
    console.log('');

    // Get gold futures data
    console.log('4. Getting gold futures data (GC)...');
    const futuresData = await client.getPriceBySymbol('GC');
    if (futuresData.success) {
      console.log('📊 Gold Futures (GC):');
      console.log(`   Price: $${futuresData.data.price}`);
      console.log(`   Open: $${futuresData.data.open}`);
      console.log(`   High: $${futuresData.data.high}`);
      console.log(`   Low: $${futuresData.data.low}`);
      console.log(`   Previous Close: $${futuresData.data.previousClose}`);
      console.log(`   Change: ${futuresData.data.change > 0 ? '+' : ''}${futuresData.data.change}`);
      console.log(`   Change %: ${futuresData.data.changePercent > 0 ? '+' : ''}${futuresData.data.changePercent}%`);
    }
    console.log('');

    // Get historical data
    console.log('5. Getting 7-day historical data...');
    const historical = await client.getHistoricalData('XAUUSD', 7);
    if (historical.success && historical.data.length > 0) {
      console.log('📈 7-Day Historical Data (XAUUSD):');
      historical.data.slice(0, 5).forEach(day => {
        console.log(`   ${day.date}: Open: $${day.open}, High: $${day.high}, Low: $${day.low}, Close: $${day.close}`);
      });
      if (historical.data.length > 5) {
        console.log(`   ... and ${historical.data.length - 5} more days`);
      }
    }
    console.log('');

    // Connect to WebSocket for real-time updates
    console.log('6. Connecting to WebSocket for real-time updates...');
    console.log('   (Press Ctrl+C to stop)\n');
    const ws = client.connectWebSocket();

    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n👋 Disconnecting...');
      ws.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error running examples:', error.message);
    process.exit(1);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();
}

module.exports = GoldFuturesClient;
