import { createWorker } from 'tesseract.js';
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AABQAFAO8lCUwAAAAASUVORK5CYII=';
const buffer = Buffer.from(pngBase64, 'base64');
const worker = await createWorker();
console.log('load type', typeof worker.load);
try {
  await worker.load();
  const result = await worker.recognize(buffer);
  console.log('RESULT', result);
} catch (err) {
  console.error('ERROR', err);
} finally {
  if (typeof worker.terminate === 'function') await worker.terminate();
}
