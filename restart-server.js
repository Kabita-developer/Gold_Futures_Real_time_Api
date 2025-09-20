// Restart Server Script
const { spawn, exec } = require('child_process');

console.log('🔄 Restarting Gold Futures API Server...\n');

// Kill existing Node.js processes
exec('taskkill /F /IM node.exe', (error) => {
  if (error) {
    console.log('⚠️  No existing Node.js processes to kill');
  } else {
    console.log('✅ Killed existing Node.js processes');
  }
  
  // Wait 2 seconds for ports to be released
  setTimeout(() => {
    console.log('🚀 Starting server...\n');
    
    // Start the server
    const server = spawn('node', ['server.js'], {
      stdio: 'inherit',
      shell: true
    });
    
    server.on('error', (error) => {
      console.error('❌ Failed to start server:', error);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down server...');
      server.kill('SIGINT');
      process.exit(0);
    });
    
  }, 2000);
});
