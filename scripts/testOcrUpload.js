const http = require('http');
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9Dl06j0AAAAASUVORK5CYII=';
const buffer = Buffer.from(pngBase64, 'base64');
const body = Buffer.concat([
  Buffer.from('--' + boundary + '\r\n'),
  Buffer.from('Content-Disposition: form-data; name="prescriptionImage"; filename="test.png"\r\n'),
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
  res.on('end', () => {
    console.log('BODY', data);
  });
});

req.on('error', (err) => console.error('ERROR', err.message));
req.write(body);
req.end();
