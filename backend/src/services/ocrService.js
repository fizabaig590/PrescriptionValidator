import { createWorker } from "tesseract.js";
import { preprocessImageForOcr } from "./ocrPreprocess.js";

// Prescription text is typically sparse and line-like.
// We'll use a page segmentation mode geared towards short multi-line text.
const OCR_PAGE_SEG_MODE = 6;

export async function extractTextFromImageBuffer(buffer) {

  const worker = await createWorker();

  if (typeof worker.on === "function") {
    worker.on("error", (err) => {
      console.error("Tesseract worker event error:", err);
    });
  }

  try {
    // Tesseract.js v6 workers are typically pre-loaded.
    // This repo's tesseract.js version does not expose `loadLanguage`/`initialize`,
    // so we rely on worker defaults and only tune parameters.



    // Keep preprocessing as no-op for now (no native image libs installed).
    // Using preprocessedBuffer may break some image formats in certain tesseract builds.
    const processedBuffer = buffer;

    // Run a single OCR pass and tune towards prescription text.
    // Use a generous whitelist and text segmentation mode for medical labels.
    if (typeof worker.setParameters === "function") {
      await worker.setParameters({
        tessedit_pageseg_mode: OCR_PAGE_SEG_MODE,
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-()/.,+ %"
      });
    }


    const {
      data: { text, confidence }
    } = await worker.recognize(processedBuffer);

    return {
      text: text?.trim() ?? "",
      confidence: Math.round(confidence ?? 0)
    };

  } catch (error) {
    console.error("OCR worker error:", error);
    return {
      text: "",
      confidence: 0
    };
  } finally {
    await worker.terminate();
  }
}

