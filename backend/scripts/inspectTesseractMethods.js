import { createWorker } from 'tesseract.js';
const worker = await createWorker();
console.log('worker', worker);
console.log('proto keys', Object.getOwnPropertyNames(Object.getPrototypeOf(worker)));
console.log('load', typeof worker.load);
console.log('loadLanguage', typeof worker.loadLanguage);
console.log('initialize', typeof worker.initialize);
console.log('recognize', typeof worker.recognize);
console.log('terminate', typeof worker.terminate);
