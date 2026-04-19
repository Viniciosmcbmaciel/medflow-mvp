-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('PARTICULAR', 'CONVENIO');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "appointmentType" "AppointmentType" NOT NULL DEFAULT 'PARTICULAR',
ADD COLUMN     "insuranceName" TEXT;
