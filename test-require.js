// Test file to check if modules can be required
console.log('Testing module requirements...');

try {
  const express = require('express');
  console.log('✅ Express loaded successfully');
} catch (error) {
  console.log('❌ Express failed to load:', error.message);
}

try {
  const mongoose = require('mongoose');
  console.log('✅ Mongoose loaded successfully');
} catch (error) {
  console.log('❌ Mongoose failed to load:', error.message);
}

try {
  const axios = require('axios');
  console.log('✅ Axios loaded successfully');
} catch (error) {
  console.log('❌ Axios failed to load:', error.message);
}

console.log('Test completed.');
