import { deflateSync } from 'zlib';
import { createWorker } from 'tesseract.js';

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
  }
  return (c ^ -1) >>> 0;
}

const table = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[i] = c >>> 0;
  }
  return t;
})();

function chunk(type, data) {
  const header = Buffer.alloc(8);
  header.write(type, 0, 4, 'ascii');
  header.writeUInt32BE(data.length, 4);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 0);
  return Buffer.concat([header, data, crcBuf]);
}

const pngHeader = Buffer.from('89504e470d0a1a0a', 'hex');
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(1, 0);
ihdr.writeUInt32BE(1, 4);
ihdr[8] = 8;
ihdr[9] = 2;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;
const idat = deflateSync(Buffer.from([0, 0, 0, 0, 0]));
const png = Buffer.concat([pngHeader, chunk('IHDR', ihdr), chunk('IDAT', idat), Buffer.from([0,0,0,0])]);
console.log('PNG length', png.length);

const worker = await createWorker();
console.log('worker loaded', typeof worker.recognize);
try {
  const result = await worker.recognize(png);
  console.log('result', result);
} catch (err) {
  console.error('ocr error', err);
} finally {
  if (typeof worker.terminate === 'function') await worker.terminate();
}
