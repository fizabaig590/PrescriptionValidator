import { prisma } from "../lib/prisma.js";
import { seedMedicines } from "../data/seedMedicines.js";
import { medicineCombinations } from "../data/medicineCombinations.js";
import { allergyMatches, enhanceMedicine } from "../data/medicineMetadata.js";
import {
  extractDosage,
  normalizePrescriptionText
} from "../utils/prescriptionParser.js";

function normalizeForMatch(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function compactMedicineLabel(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\b\d+(\.\d+)?\s*(mg|mcg|g|ml|iu|units|unit|%|sachet|sachets|tablet|tablets|capsule|capsules|syrup|suspension|drops|drop|cream|ointment|gel|lotion|injection|injectable|infusion|inhaler|spray|bottle|powder|lozenge|caplet|solution|wash|oil|pen|cartridge|vial)\b/g, "")
    .replace(/\b(tablet|tablets|capsule|capsules|syrup|suspension|drops|cream|ointment|gel|lotion|injection|infusion|inhaler|spray|bottle|powder|lozenge|solution|wash|oil|pen|cartridge|vial|sr|er|mr|ec|ds|cv|forte|oral|film|dispersible|chewable|sublingual)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function medicineMatchesCombinationName(medicine, combinationName) {
  const target = normalizeForMatch(String(combinationName ?? ""));
  const medicineName = normalizeForMatch(medicine.name ?? "");
  const compactName = normalizeForMatch(compactMedicineLabel(medicine.name));
  const genericName = normalizeForMatch(medicine.genericName ?? "");

  return (
    target &&
    (medicineName === target ||
      compactName === target ||
      medicineName.startsWith(target) ||
      compactName.startsWith(target) ||
      genericName === target ||
      (genericName.length > 3 && target.includes(genericName)) ||
      (target.length > 3 && genericName.includes(target)))
  );
}

function levenshteinDistance(left, right) {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }

  for (let col = 0; col < cols; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost
      );
    }
  }

  return matrix[rows - 1][cols - 1];
}

function findMedicineMatch(line, catalog) {
  const normalizedLine = normalizeForMatch(line);

  const directMatch = catalog
    .filter((medicine) => {
      const normalizedName = normalizeForMatch(medicine.name);
      const normalizedGenericName = normalizeForMatch(medicine.genericName ?? "");

      return (
        (normalizedName && normalizedLine.includes(normalizedName)) ||
        (normalizedGenericName && normalizedLine.includes(normalizedGenericName))
      );
    })
    .sort((left, right) => normalizeForMatch(right.name).length - normalizeForMatch(left.name).length)[0];

  if (directMatch) {
    return directMatch;
  }

  const tokens = line
    .split(/\s+/)
    .map((token) => normalizeForMatch(token))
    .filter((token) => token.length >= 3);

  let bestMatch = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const medicine of catalog) {
    const normalizedMedicineName = normalizeForMatch(medicine.name);
    const normalizedGenericName = normalizeForMatch(medicine.genericName ?? "");

    for (const token of tokens) {
      if (!token) continue;

      for (const candidate of [normalizedMedicineName, normalizedGenericName]) {
        if (!candidate) continue;

        if (candidate.includes(token) || token.includes(candidate)) {
          bestMatch = medicine;
          bestDistance = 0;
          break;
        }

        const distance = levenshteinDistance(token, candidate);
        const maxDistance = Math.max(1, Math.floor(candidate.length * 0.33));

        if (distance <= maxDistance && distance < bestDistance) {
          bestDistance = distance;
          bestMatch = medicine;
        }
      }

      if (bestDistance === 0) {
        break;
      }
    }

    if (bestDistance === 0) {
      break;
    }
  }

  // fallback: compare whole line against medicine name and generic name (helps with OCR errors)
  if (!bestMatch) {
    for (const medicine of catalog) {
      const normalizedMedicineName = normalizeForMatch(medicine.name);
      const normalizedGenericName = normalizeForMatch(medicine.genericName ?? "");
      const distanceName = levenshteinDistance(normalizedLine, normalizedMedicineName);
      const distanceGeneric = normalizedGenericName
        ? levenshteinDistance(normalizedLine, normalizedGenericName)
        : Number.POSITIVE_INFINITY;
      const maxDistanceName = Math.max(2, Math.floor(normalizedMedicineName.length * 0.25));
      const maxDistanceGeneric = normalizedGenericName
        ? Math.max(2, Math.floor(normalizedGenericName.length * 0.25))
        : Number.POSITIVE_INFINITY;

      if (distanceName <= maxDistanceName || distanceGeneric <= maxDistanceGeneric) {
        bestMatch = medicine;
        break;
      }
    }
  }

  return bestMatch;
}

function findCatalogMentions(text, catalog) {
  const normalizedText = normalizeForMatch(text);

  return catalog.filter((medicine) => {
    const normalizedName = normalizeForMatch(medicine.name);
    const normalizedGenericName = normalizeForMatch(medicine.genericName ?? "");

    return (
      (normalizedName && normalizedText.includes(normalizedName)) ||
      (normalizedGenericName && normalizedText.includes(normalizedGenericName))
    );
  });
}

function normalizeUnit(unit) {
  if (!unit) {
    return null;
  }

  if (unit === "tablets") {
    return "tablet";
  }

  if (unit === "capsules") {
    return "capsule";
  }

  return unit;
}

function buildSummary(warnings, recognizedCount) {
  if (!recognizedCount) {
    return "No medicine from the database matched the extracted text.";
  }

  if (!warnings.length) {
    return "No dosage, allergy, or interaction issues were detected in the recognized medicines.";
  }

  return `${warnings.length} warning(s) detected across ${recognizedCount} recognized medicine(s).`;
}

function calculateSafetyScore(warnings) {
  const penalties = warnings.reduce((score, warning) => {
    if (warning.type === "interaction") {
      return score + (warning.severity === "high" ? 30 : 18);
    }

    if (warning.type === "allergy") {
      return score + 24;
    }

    if (warning.type === "dosage") {
      return score + 16;
    }

    if (warning.type === "unknown") {
      return score + 8;
    }

    return score + 10;
  }, 0);

  return Math.max(0, 100 - penalties);
}

async function loadMedicineCatalog() {
  try {
    const catalog = await prisma.medicine.findMany({
      include: {
        interactionsA: {
          include: {
            medicineB: true
          }
        },
        interactionsB: {
          include: {
            medicineA: true
          }
        }
      }
    });

    if (catalog.length) {
      return catalog.map(enhanceMedicine);
    }
  } catch (_error) {
    // fallback to seed data below
  }

  return seedMedicines.map((medicine) => ({
    ...enhanceMedicine(medicine),
    interactionsA: [],
    interactionsB: []
  }));
}

export async function validatePrescription({
  prescriptionText,
  allergies = [],
  scanMetadata = null
}) {
  const lines = normalizePrescriptionText(prescriptionText);
  const catalog = await loadMedicineCatalog();

  const warnings = [];
  const medicines = [];
  const recognizedMedicineIds = new Set();

  for (const line of lines) {
    const match = findMedicineMatch(line, catalog);

    const dosage = extractDosage(line);

    if (!match) {
      continue;
    }

    if (!recognizedMedicineIds.has(match.id)) {
      medicines.push({
        id: match.id,
        name: match.name,
        dosage: dosage?.raw ?? null,
        genericName: match.genericName,
        description: match.notes,
        category: match.category,
        dosageRange:
          match.minDosageValue !== null && match.maxDosageValue !== null && match.dosageUnit
            ? `${match.minDosageValue}-${match.maxDosageValue}${match.dosageUnit}`
            : null,
        allergyTags: match.allergyTags,
        recognized: true
      });
      recognizedMedicineIds.add(match.id);
    } else if (dosage) {
      const existingMedicine = medicines.find((medicine) => medicine.id === match.id);

      if (existingMedicine && !existingMedicine.dosage) {
        existingMedicine.dosage = dosage.raw;
      }
    }

    if (
      dosage &&
      match.minDosageValue !== null &&
      match.maxDosageValue !== null &&
      normalizeUnit(match.dosageUnit) === normalizeUnit(dosage.unit) &&
      (dosage.value < match.minDosageValue || dosage.value > match.maxDosageValue)
    ) {
      warnings.push({
        type: "dosage",
        severity: "medium",
        message: `${match.name} dosage ${dosage.raw} is outside the configured range of ${match.minDosageValue}${match.dosageUnit}-${match.maxDosageValue}${match.dosageUnit}.`
      });
    }

    if (!dosage && match.minDosageValue !== null) {
      warnings.push({
        type: "dosage",
        severity: "low",
        message: `${match.name} does not include a readable dosage value.`
      });
    }

    const allergyHit = allergyMatches(allergies, match.allergyTags);

    if (allergyHit) {
      warnings.push({
        type: "allergy",
        severity: "high",
        message: `${match.name} conflicts with the reported allergy "${allergyHit}".`
      });
    }
  }

  for (const medicine of findCatalogMentions(prescriptionText, catalog)) {
    if (recognizedMedicineIds.has(medicine.id)) {
      continue;
    }

    medicines.push({
      id: medicine.id,
      name: medicine.name,
      dosage: null,
      genericName: medicine.genericName,
      description: medicine.notes,
      category: medicine.category,
      dosageRange:
        medicine.minDosageValue !== null && medicine.maxDosageValue !== null && medicine.dosageUnit
          ? `${medicine.minDosageValue}-${medicine.maxDosageValue}${medicine.dosageUnit}`
          : null,
      allergyTags: medicine.allergyTags,
      recognized: true
    });
    recognizedMedicineIds.add(medicine.id);
  }

  const recognized = catalog.filter((medicine) => recognizedMedicineIds.has(medicine.id));

  const seenPairs = new Set();

  for (const medicine of recognized) {
    const linkedInteractions = [
      ...medicine.interactionsA.map((item) => ({
        ...item,
        counterpart: item.medicineB
      })),
      ...medicine.interactionsB.map((item) => ({
        ...item,
        counterpart: item.medicineA
      }))
    ];

    for (const interaction of linkedInteractions) {
      if (!recognized.some((entry) => entry.id === interaction.counterpart.id)) {
        continue;
      }

      const key = [medicine.id, interaction.counterpart.id].sort((a, b) => a - b).join(":");

      if (seenPairs.has(key)) {
        continue;
      }

      seenPairs.add(key);
      warnings.push({
        type: "interaction",
        severity: interaction.severity,
        message: interaction.warning
      });
    }
  }

  for (const combination of medicineCombinations) {
    if (combination.type === "safe") {
      continue;
    }

    const first = recognized.find((medicine) =>
      medicineMatchesCombinationName(medicine, combination.medicines?.[0])
    );
    const second = recognized.find((medicine) =>
      medicineMatchesCombinationName(medicine, combination.medicines?.[1])
    );

    if (!first || !second || first.id === second.id) {
      continue;
    }

    const key = [first.id, second.id].sort((a, b) => a - b).join(":");

    if (seenPairs.has(key)) {
      continue;
    }

    seenPairs.add(key);
    warnings.push({
      type: "interaction",
      severity: combination.severity,
      message: combination.notes
    });
  }

  return {
    extractedText: prescriptionText,
    medicines: medicines.map(({ id, ...medicine }) => medicine),
    warnings,
    safetyScore: calculateSafetyScore(warnings),
    summary: buildSummary(warnings, recognized.length),
    scanMetadata
  };
}
