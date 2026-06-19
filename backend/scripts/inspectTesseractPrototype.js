import { createWorker } from 'tesseract.js';
const worker = createWorker();
console.log('worker', worker);
console.log('proto keys', Object.getOwnPropertyNames(Object.getPrototypeOf(worker)));
console.log('proto', Object.getPrototypeOf(worker));
console.log('constructor', worker.constructor.name);
