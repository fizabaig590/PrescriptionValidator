import { Router } from "express";
import multer from "multer";
import { validatePrescription } from "../services/validationService.js";
import { saveValidationHistory, getValidationHistory } from "../services/historyService.js";
import { extractTextFromImageBuffer } from "../services/ocrService.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/text", async (request, response, next) => {
  try {
    const { prescriptionText = "", allergies = [] } = request.body ?? {};

    if (!prescriptionText.trim()) {
      return response.status(400).json({
        message: "prescriptionText is required."
      });
    }

    const result = await validatePrescription({
      prescriptionText,
      allergies: Array.isArray(allergies) ? allergies : []
    });

    try {
      await saveValidationHistory({
        sourceType: "text",
        sourceLabel: "Manual text input",
        extractedText: prescriptionText,
        allergies: Array.isArray(allergies) ? allergies : [],
        result: {
          ...result,
          sourceLabel: "Manual text input"
        }
      });
    } catch (saveError) {
      console.error("Failed to save validation history:", saveError);
    }

    return response.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/image",
  upload.single("prescriptionImage"),
  async (request, response, next) => {
    try {
      if (!request.file) {
        return response.status(400).json({
          message: "prescriptionImage is required."
        });
      }

      const allergies = [];

      const ocrResult = await extractTextFromImageBuffer(request.file.buffer);

      const result = await validatePrescription({
        prescriptionText: ocrResult.text,
        allergies,
        scanMetadata: {
          ocrConfidence: ocrResult.confidence,
          lowConfidence: ocrResult.confidence < 55
        }
      });

      // Return OCR results even if confidence is low, as long as text was extracted.
      // Low confidence will still be flagged in the response for user awareness.

      try {
        await saveValidationHistory({
          sourceType: "image",
          sourceLabel: request.file.originalname,
          extractedText: ocrResult.text,
          allergies,
          result: {
            ...result,
            ocrConfidence: ocrResult.confidence,
            sourceLabel: request.file.originalname
          }
        });
      } catch (saveError) {
        console.error("Failed to save image validation history:", saveError);
      }

      return response.json({
        ...result,
        ocrConfidence: ocrResult.confidence,
        sourceLabel: request.file.originalname
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.get("/history", async (_request, response) => {
  try {
    const history = await getValidationHistory();
    return response.json(history);
  } catch (_error) {
    return response.json([]);
  }
});

export default router;
