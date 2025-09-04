#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'dev.log');

// Clear previous log file
if (fs.existsSync(logFile)) {
  fs.unlinkSync(logFile);
}

// Create write stream for log file
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Spawn the development server
const child = spawn('npx', ['tsx', 'server.ts'], {
  stdio: 'pipe',
  shell: true
});

// Pipe stdout to both console and log file
child.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  logStream.write(output);
});

// Pipe stderr to both console and log file
child.stderr.on('data', (data) => {
  const output = data.toString();
  process.stderr.write(output);
  logStream.write(output);
});

// Handle process exit
child.on('close', (code) => {
  logStream.end();
  process.exit(code);
});

// Handle errors
child.on('error', (error) => {
  console.error('Failed to start development server:', error);
  logStream.end();
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
  process.exit(0);
});