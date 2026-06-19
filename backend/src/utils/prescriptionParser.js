const dosagePattern = /(\d+(?:\.\d+)?)\s*(mg|ml|mcg|g|tablet|tablets|capsule|capsules)/i;
const ignoredLinePatterns = [
  /^sig\b/i,
  /^take\b/i,
  /^every\b/i,
  /^for\b/i,
  /^po\b/i,
  /^tab\b/i
];

export function extractDosage(line) {
  const match = line.match(dosagePattern);

  if (!match) {
    return null;
  }

  return {
    raw: `${match[1]}${match[2].toLowerCase()}`,
    value: Number(match[1]),
    unit: match[2].toLowerCase()
  };
}

export function normalizePrescriptionText(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.length >= 4)
    .filter((line) => /[a-z]/i.test(line))
    .filter((line) => !ignoredLinePatterns.some((pattern) => pattern.test(line)));
}
