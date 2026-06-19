import { extractTextFromImageBuffer } from '../src/services/ocrService.js';
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9Dl06j0AAAAASUVORK5CYII=';
const buffer = Buffer.from(pngBase64, 'base64');

try {
  const result = await extractTextFromImageBuffer(buffer);
  console.log('RESULT', result);
} catch (err) {
  console.error('ERROR', err);
}
