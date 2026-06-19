import { Router } from "express";
import { medicineCombinations } from "../data/medicineCombinations.js";

const router = Router();

function normalizeForMatch(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function compactMedicineName(value) {
  return normalizeForMatch(value)
    .replace(/\b\d+(\.\d+)?\s*(mg|mcg|g|ml|iu|units|unit|%|sachet|sachets|tablet|tablets|capsule|capsules|syrup|suspension|drops|drop|cream|ointment|gel|lotion|injection|injectable|infusion|inhaler|spray|bottle|powder|lozenge|caplet|solution|wash|oil|pen|cartridge|vial)\b/g, "")
    .replace(/\b(tablet|tablets|capsule|capsules|syrup|suspension|drops|cream|ointment|gel|lotion|injection|infusion|inhaler|spray|bottle|powder|lozenge|solution|wash|oil|pen|cartridge|vial|sr|er|mr|ec|ds|cv|forte|oral|film|dispersible|chewable|sublingual)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function medicinesMatch(ruleName, inputName) {
  const rule = normalizeForMatch(ruleName);
  const input = normalizeForMatch(inputName);
  const compactRule = compactMedicineName(ruleName);
  const compactInput = compactMedicineName(inputName);

  return (
    rule === input ||
    rule === compactInput ||
    compactRule === input ||
    compactRule === compactInput ||
    input.startsWith(`${rule} `) ||
    rule.startsWith(`${input} `)
  );
}

router.post("/check", (req, res) => {
  try {
    const { medicine1, medicine2 } = req.body ?? {};

    const m1 = normalizeForMatch(medicine1);
    const m2 = normalizeForMatch(medicine2);

    if (!m1 || !m2) {
      return res.status(400).json({ message: "medicine1 and medicine2 are required." });
    }

    const found = medicineCombinations.find((c) => {
      const a = c.medicines?.[0];
      const b = c.medicines?.[1];

      return (
        (medicinesMatch(a, medicine1) && medicinesMatch(b, medicine2)) ||
        (medicinesMatch(a, medicine2) && medicinesMatch(b, medicine1))
      );
    });

    return res.json(
      found
        ? { found: true, combination: found }
        : { found: false, combination: null }
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;

