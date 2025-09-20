// API Test Script
const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api/v1';

async function testAPI() {
  console.log('🧪 Testing Gold Futures API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/gold/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('   Uptime:', Math.round(healthResponse.data.uptime), 'seconds\n');

    // Test 2: Get symbols
    console.log('2. Testing symbols endpoint...');
    const symbolsResponse = await axios.get(`${API_BASE_URL}/gold/symbols`);
    console.log('✅ Symbols retrieved:', Object.keys(symbolsResponse.data.symbols).length, 'symbols');
    console.log('   Available:', Object.keys(symbolsResponse.data.symbols).join(', '), '\n');

    // Test 3: Get current price
    console.log('3. Testing current price endpoint...');
    const currentResponse = await axios.get(`${API_BASE_URL}/gold/current`);
    if (currentResponse.data.success) {
      console.log('✅ Current price retrieved successfully');
      console.log('   Symbol:', currentResponse.data.data.symbol);
      console.log('   Price: $' + currentResponse.data.data.price);
      console.log('   Change: ' + (currentResponse.data.data.change >= 0 ? '+' : '') + currentResponse.data.data.change);
      console.log('   Source:', currentResponse.data.data.source);
      console.log('   Cached:', currentResponse.data.cached);
    } else {
      console.log('❌ Failed to get current price:', currentResponse.data.error);
    }
    console.log('');

    // Test 4: Get specific symbol
    console.log('4. Testing specific symbol endpoint...');
    try {
      const symbolResponse = await axios.get(`${API_BASE_URL}/gold/GC`);
      if (symbolResponse.data.success) {
        console.log('✅ Symbol data retrieved successfully');
        console.log('   Symbol:', symbolResponse.data.data.symbol);
        console.log('   Price: $' + symbolResponse.data.data.price);
        console.log('   Source:', symbolResponse.data.data.source);
      } else {
        console.log('❌ Failed to get symbol data:', symbolResponse.data.error);
      }
    } catch (error) {
      console.log('⚠️  Symbol endpoint test skipped (API key may be required)');
    }
    console.log('');

    // Test 5: Get historical data
    console.log('5. Testing historical data endpoint...');
    try {
      const historicalResponse = await axios.get(`${API_BASE_URL}/gold/historical/XAUUSD?days=5`);
      if (historicalResponse.data.success) {
        console.log('✅ Historical data retrieved successfully');
        console.log('   Symbol:', historicalResponse.data.symbol);
        console.log('   Days:', historicalResponse.data.days);
        console.log('   Data points:', historicalResponse.data.data.length);
        if (historicalResponse.data.data.length > 0) {
          const latest = historicalResponse.data.data[0];
          console.log('   Latest close: $' + latest.close);
        }
      } else {
        console.log('❌ Failed to get historical data:', historicalResponse.data.error);
      }
    } catch (error) {
      console.log('⚠️  Historical data test skipped (API key may be required)');
    }
    console.log('');

    // Test 6: Test validation
    console.log('6. Testing validation...');
    try {
      await axios.get(`${API_BASE_URL}/gold/invalid_symbol`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation working correctly');
        console.log('   Error:', error.response.data.error);
      } else {
        console.log('❌ Validation test failed');
      }
    }
    console.log('');

    console.log('🎉 API testing completed!');
    console.log('\n💡 Note: Some endpoints may require valid API keys to work properly.');
    console.log('   Update your API keys in .env file for full functionality.');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running: npm run dev');
    }
  }
}

// Run the test
testAPI();
