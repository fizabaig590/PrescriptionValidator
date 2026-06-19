-- CreateTable
CREATE TABLE "ValidationHistory" (
    "id" SERIAL NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceLabel" TEXT,
    "extractedText" TEXT NOT NULL,
    "allergies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "safetyScore" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValidationHistory_pkey" PRIMARY KEY ("id")
);
