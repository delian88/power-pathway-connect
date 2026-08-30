import fs from 'fs';
import path from 'path';

if (process.env.VERCEL || process.env.VERCEL_ENV) {
  console.log('Vercel environment detected. Skipping manual postbuild.js step.');
  process.exit(0);
}

const srcDir = path.resolve('.output/public');
const destDir = path.resolve('dist');

if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}

fs.cpSync(srcDir, destDir, { recursive: true });

import { spawn } from 'child_process';
import http from 'http';


// Parse .env manually to ensure DATABASE_URL is available for the Node server
const envPath = path.resolve('.env');
const env = { ...process.env };
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      env[match[1]] = match[2].replace(/(^['"]|['"]$)/g, '');
    }
  });
}

console.log('Starting local server to generate index.html...');
const serverProcess = spawn('node', ['.output/server/index.mjs'], { env });

// Wait 3 seconds for server to start, then fetch index.html
setTimeout(() => {
  http.get('http://localhost:3000/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      fs.writeFileSync(path.join(destDir, 'index.html'), data);
      console.log('Successfully generated index.html!');
      serverProcess.kill();
      process.exit(0);
    });
  }).on('error', err => {
    console.error('Failed to get index.html:', err.message);
    serverProcess.kill();
    process.exit(1);
  });
}, 3000);
