// Live Gold Price Ticker via WebSocket
const WebSocket = require('ws');
const Table = require('cli-table3'); // prettier console tables
const chalk = require('chalk').default;

const ws = new WebSocket('ws://localhost:8080');

// Create table headers
const table = new Table({
  head: ['Symbol', 'Price', 'Change', 'Change %', 'Source', 'Last Update'],
  colWidths: [10, 12, 10, 12, 15, 25],
});

// Keep latest data for table
let latestData = {};

console.log(chalk.blue('🔌 Connecting to Gold WebSocket...'));

ws.on('open', () => {
  console.log(chalk.green('✅ WebSocket connected! Listening for updates...\n'));
});

ws.on('message', (data) => {
  try {
    const goldData = JSON.parse(data);

    const symbol = goldData.data.symbol;
    latestData[symbol] = {
      price: goldData.data.price.toFixed(2),
      change: goldData.data.change.toFixed(2),
      changePercent: goldData.data.changePercent.toFixed(2),
      source: goldData.data.source,
      timestamp: new Date(goldData.timestamp).toLocaleTimeString(),
    };

    // Clear console and redraw table
    console.clear();
    table.splice(0, table.length); // reset table rows
    Object.entries(latestData).forEach(([sym, d]) => {
      // color change green/red
      const changeColor = d.change >= 0 ? chalk.green : chalk.red;
      table.push([
        sym,
        d.price,
        changeColor(d.change),
        changeColor(d.changePercent + '%'),
        d.source,
        d.timestamp,
      ]);
    });

    console.log(table.toString());
  } catch (err) {
    console.log('📦 Raw message:', data.toString());
  }
});

ws.on('error', (err) => console.error(chalk.red('❌ WebSocket error:'), err.message));
ws.on('close', () => console.log(chalk.yellow('🔌 WebSocket connection closed')));

// Keep running indefinitely
