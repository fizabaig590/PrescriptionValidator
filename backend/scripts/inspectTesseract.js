import { createWorker } from 'tesseract.js';
const worker = createWorker();
console.log('worker keys', Object.keys(worker));
console.log('load', typeof worker.load);
console.log('loadLanguage', typeof worker.loadLanguage);
console.log('initialize', typeof worker.initialize);
console.log('recognize', typeof worker.recognize);
console.log('setParameters', typeof worker.setParameters);
console.log('terminate', typeof worker.terminate);
