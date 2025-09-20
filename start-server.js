// Comprehensive Server Startup Script
const { spawn } = require('child_process');
const net = require('net');

// Function to check if port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => {
        resolve(false);
      });
      server.close();
    });
    server.on('error', () => {
      resolve(true);
    });
  });
}

// Function to kill processes on specific ports
async function killPortProcesses(ports) {
  const { exec } = require('child_process');
  
  for (const port of ports) {
    try {
      const result = await new Promise((resolve, reject) => {
        exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
          if (error) {
            resolve(null);
            return;
          }
          const lines = stdout.split('\n');
          for (const line of lines) {
            if (line.includes(`:${port}`) && line.includes('LISTENING')) {
              const parts = line.trim().split(/\s+/);
              const pid = parts[parts.length - 1];
              if (pid && !isNaN(pid)) {
                exec(`taskkill /F /PID ${pid}`, (killError) => {
                  if (!killError) {
                    console.log(`✅ Killed process ${pid} on port ${port}`);
                  }
                });
              }
            }
          }
          resolve(true);
        });
      });
    } catch (error) {
      console.log(`⚠️  Could not check port ${port}:`, error.message);
    }
  }
}

// Main startup function
async function startServer() {
  console.log('🚀 Starting Gold Futures API Server...');
  
  // Kill any existing processes on our ports
  await killPortProcesses([4000, 8080]);
  
  // Wait a moment for ports to be released
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Check if ports are available
  const port4000InUse = await isPortInUse(4000);
  const port8080InUse = await isPortInUse(8080);
  
  if (port4000InUse) {
    console.log('❌ Port 4000 is still in use');
    return;
  }
  
  if (port8080InUse) {
    console.log('❌ Port 8080 is still in use');
    return;
  }
  
  console.log('✅ Ports 4000 and 8080 are available');
  
  // Start the server
  const serverProcess = spawn('node', ['server.js'], {
    stdio: 'inherit',
    shell: true
  });
  
  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
  });
  
  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    serverProcess.kill('SIGTERM');
    process.exit(0);
  });
}

// Start the server
startServer().catch(console.error);
