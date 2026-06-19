// Lightweight image preprocessing for OCR using only built-in dependencies.
// Note: tesseract.js can accept images as raw bytes; preprocessing here is intentionally minimal
// to avoid native deps (like canvas). If you later add `sharp` or `canvas`, this can be expanded.

import { Buffer } from "buffer";

function noOp(buffer) {
  return buffer;
}

/**
 * Best-effort preprocessing hook.
 * Currently a no-op placeholder to keep the OCR pipeline stable without native deps.
 * If you install `sharp` (recommended), we can implement grayscale/thresholding/upscale here.
 */
export function preprocessImageForOcr(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    return Buffer.from([]);
  }

  return noOp(buffer);
}

