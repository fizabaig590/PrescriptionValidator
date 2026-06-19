import { prisma } from "../lib/prisma.js";

export async function saveValidationHistory({
  sourceType,
  sourceLabel,
  extractedText,
  allergies,
  result
}) {
  return prisma.validationHistory.create({
    data: {
      sourceType,
      sourceLabel,
      extractedText,
      allergies,
      safetyScore: result.safetyScore,
      summary: result.summary,
      result
    }
  });
}

export async function getValidationHistory(limit = 10) {
  const entries = await prisma.validationHistory.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: limit
  });

  return entries.map((entry) => ({
    id: entry.id,
    sourceType: entry.sourceType,
    sourceLabel: entry.sourceLabel,
    extractedText: entry.extractedText,
    allergies: entry.allergies,
    safetyScore: entry.safetyScore,
    summary: entry.summary,
    result: entry.result,
    createdAt: entry.createdAt
  }));
}
