const https = require('https');
const fs = require('fs');

const url = 'https://upload.wikimedia.org/wikipedia/en/8/87/Nigerian_Electricity_Regulatory_Commission_logo.png';
const file = fs.createWriteStream('public/nerc-logo.png');

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download completed');
  });
}).on('error', (err) => {
  fs.unlink('public/nerc-logo.png', () => {});
  console.error('Error downloading:', err.message);
});
