-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;

-- CreateTable
CREATE TABLE "medical_evolutions" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "chiefComplaint" TEXT,
    "diagnosis" TEXT,
    "conduct" TEXT,
    "observations" TEXT,
    "cid" TEXT,
    "bloodPressure" TEXT,
    "weight" TEXT,
    "height" TEXT,
    "temperature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medical_evolutions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "medical_evolutions" ADD CONSTRAINT "medical_evolutions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
