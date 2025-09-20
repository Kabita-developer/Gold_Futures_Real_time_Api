// Comprehensive Test Script for Gold Futures API
const axios = require('axios');
const WebSocket = require('ws');

const BASE_URL = 'http://localhost:4000';
const WS_URL = 'ws://localhost:8080';

console.log('🧪 Testing Gold Futures API...\n');

// Test HTTP endpoints
async function testHttpEndpoints() {
  console.log('📡 Testing HTTP Endpoints:');
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get(`${BASE_URL}/api/v1/gold/health`);
    console.log('✅ Health check:', healthResponse.data.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  try {
    // Test current price endpoint
    const priceResponse = await axios.get(`${BASE_URL}/api/v1/gold/current`);
    console.log('✅ Current price:', priceResponse.data.data.price);
  } catch (error) {
    console.log('❌ Current price failed:', error.message);
  }

  try {
    // Test symbols endpoint
    const symbolsResponse = await axios.get(`${BASE_URL}/api/v1/gold/symbols`);
    console.log('✅ Available symbols:', Object.keys(symbolsResponse.data.symbols).join(', '));
  } catch (error) {
    console.log('❌ Symbols failed:', error.message);
  }
}

// Test WebSocket
function testWebSocket() {
  console.log('\n🔌 Testing WebSocket:');
  
  return new Promise((resolve) => {
    const ws = new WebSocket(WS_URL);
    let messageCount = 0;
    
    ws.on('open', () => {
      console.log('✅ WebSocket connected');
    });
    
    ws.on('message', (data) => {
      messageCount++;
      try {
        const goldData = JSON.parse(data);
        console.log(`✅ Received message ${messageCount}:`, {
          symbol: goldData.data.symbol,
          price: goldData.data.price,
          source: goldData.data.source
        });
        
        if (messageCount >= 3) {
          ws.close();
          resolve();
        }
      } catch (error) {
        console.log('❌ Invalid WebSocket message:', error.message);
        ws.close();
        resolve();
      }
    });
    
    ws.on('error', (error) => {
      console.log('❌ WebSocket error:', error.message);
      resolve();
    });
    
    ws.on('close', () => {
      console.log('🔌 WebSocket closed');
      resolve();
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      ws.close();
      resolve();
    }, 10000);
  });
}

// Main test function
async function runTests() {
  await testHttpEndpoints();
  await testWebSocket();
  
  console.log('\n🎉 Testing completed!');
  console.log('\n📋 Available Endpoints:');
  console.log(`   Health: ${BASE_URL}/api/v1/gold/health`);
  console.log(`   Current Price: ${BASE_URL}/api/v1/gold/current`);
  console.log(`   Symbols: ${BASE_URL}/api/v1/gold/symbols`);
  console.log(`   API Docs: ${BASE_URL}/api-docs`);
  console.log(`   WebSocket: ${WS_URL}`);
}

runTests().catch(console.error);
