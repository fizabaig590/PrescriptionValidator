import fs from 'fs';
import { extractTextFromImageBuffer } from '../src/services/ocrService.js';

const path = '../node_modules/tesseract.js/docs/images/tesseract.png';
const buffer = fs.readFileSync(path);

try {
  const result = await extractTextFromImageBuffer(buffer);
  console.log('RESULT', result);
} catch (err) {
  console.error('ERROR', err);
}
