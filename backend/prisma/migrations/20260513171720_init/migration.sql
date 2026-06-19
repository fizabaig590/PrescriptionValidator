-- CreateTable
CREATE TABLE "Medicine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "genericName" TEXT,
    "minDosageValue" DOUBLE PRECISION,
    "maxDosageValue" DOUBLE PRECISION,
    "dosageUnit" TEXT,
    "allergyTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" SERIAL NOT NULL,
    "medicineAId" INTEGER NOT NULL,
    "medicineBId" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "warning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_name_key" ON "Medicine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Interaction_medicineAId_medicineBId_key" ON "Interaction"("medicineAId", "medicineBId");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_medicineAId_fkey" FOREIGN KEY ("medicineAId") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_medicineBId_fkey" FOREIGN KEY ("medicineBId") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
