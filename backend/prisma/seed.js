import { PrismaClient } from "@prisma/client";
import { seedMedicines } from "../src/data/seedMedicines.js";
import { medicineCombinations } from "../src/data/medicineCombinations.js";
import { normalizeAllergyTags } from "../src/data/medicineMetadata.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.validationHistory.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.medicine.deleteMany();

  const medicines = await prisma.$transaction(
    seedMedicines.map((medicine) =>
      prisma.medicine.create({
        data: {
          name: medicine.name,
          genericName: medicine.genericName,
          minDosageValue: medicine.minDosageValue,
          maxDosageValue: medicine.maxDosageValue,
          dosageUnit: medicine.dosageUnit,
          allergyTags: normalizeAllergyTags(medicine.allergyTags),
          notes: medicine.notes
        }
      })
    )
  );

  const byName = Object.fromEntries(medicines.map((item) => [item.name, item]));

  const interactionRows = medicineCombinations
    .map((combination) => {
      const medicineA = byName[combination.medicines?.[0]];
      const medicineB = byName[combination.medicines?.[1]];

      if (!medicineA || !medicineB || combination.type === "safe") {
        return null;
      }

      return {
        medicineAId: medicineA.id,
        medicineBId: medicineB.id,
        severity: combination.severity,
        warning: combination.notes
      };
    })
    .filter(Boolean);

  if (interactionRows.length) {
    await prisma.interaction.createMany({
      data: interactionRows,
      skipDuplicates: true
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
