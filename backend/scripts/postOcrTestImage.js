import fs from 'fs';
import http from 'http';
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const filePath = '../node_modules/tesseract.js/docs/images/tesseract.png';
const buffer = fs.readFileSync(filePath);
const body = Buffer.concat([
  Buffer.from('--' + boundary + '\r\n'),
  Buffer.from('Content-Disposition: form-data; name="prescriptionImage"; filename="tesseract.png"\r\n'),
  Buffer.from('Content-Type: image/png\r\n\r\n'),
  buffer,
  Buffer.from('\r\n--' + boundary + '--\r\n')
]);
const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/validate/image',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': body.length
  }
};
const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('BODY', data));
});
req.on('error', (err) => console.error('ERROR', err.message));
req.write(body);
req.end();
