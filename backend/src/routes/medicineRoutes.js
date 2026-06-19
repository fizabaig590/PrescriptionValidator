import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { seedMedicines } from "../data/seedMedicines.js";
import { enhanceMedicine } from "../data/medicineMetadata.js";

const router = Router();

const getFallbackMedicines = () =>
  [...seedMedicines].map(enhanceMedicine).sort((a, b) => a.name.localeCompare(b.name));

router.get("/", async (_request, response) => {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: {
        name: "asc"
      }
    });

    return response.json(medicines.map(enhanceMedicine));
  } catch (_error) {
    return response.json(getFallbackMedicines());
  }
});

router.get("/search", async (request, response) => {
  const nameQuery = String(request.query.name ?? "").trim();

  if (!nameQuery) {
    return response.json([]);
  }

  const lowerQuery = nameQuery.toLowerCase();
  const categoryQuery = String(request.query.category ?? "").trim().toLowerCase();
  const allergyQuery = String(request.query.allergy ?? "").trim().toLowerCase();
  const matchesFilters = (medicine) =>
    (!categoryQuery || medicine.category.toLowerCase() === categoryQuery) &&
    (!allergyQuery || medicine.allergyTags.some((tag) => tag.toLowerCase() === allergyQuery));

  const matchedSeed = getFallbackMedicines().filter((medicine) =>
    matchesFilters(medicine) &&
    (medicine.name.toLowerCase().includes(lowerQuery) ||
      (medicine.genericName ?? "").toLowerCase().includes(lowerQuery) ||
      (medicine.notes ?? "").toLowerCase().includes(lowerQuery))
  );

  if (matchedSeed.length) {
    return response.json(matchedSeed);
  }

  try {
    const medicines = await prisma.medicine.findMany({
      where: {
        OR: [
          { name: { contains: nameQuery, mode: "insensitive" } },
          { genericName: { contains: nameQuery, mode: "insensitive" } }
        ]
      },
      orderBy: { name: "asc" }
    });

    return response.json(medicines.map(enhanceMedicine).filter(matchesFilters));
  } catch (_error) {
    return response.json([]);
  }
});

export default router;
