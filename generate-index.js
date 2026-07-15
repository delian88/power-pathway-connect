import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import http from 'http';

const destDir = path.resolve('dist');

console.log('Starting server to generate index.html...');
const serverProcess = spawn('node', ['.output/server/index.mjs'], { stdio: 'pipe' });

setTimeout(() => {
  http.get('http://localhost:3000/', (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      fs.writeFileSync(path.join(destDir, 'index.html'), data);
      console.log('Successfully generated index.html!');
      serverProcess.kill();
      process.exit(0);
    });
  }).on('error', (err) => {
    console.error('Failed to get index.html:', err.message);
    serverProcess.kill();
    process.exit(1);
  });
}, 3000); // Wait 3 seconds for server to start
