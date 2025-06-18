#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');

// Set UTF-8 encoding
if (process.platform === 'win32') {
    const { exec } = require('child_process');
    exec('chcp 65001', { encoding: 'utf8' }, () => {});
}

// Execute main program
const mainScript = path.join(__dirname, '..', 'index.js');
const child = spawn('node', [mainScript], {
    stdio: 'inherit',
    env: { ...process.env, CHCP: '65001' }
});

child.on('exit', (code) => {
    process.exit(code);
}); 