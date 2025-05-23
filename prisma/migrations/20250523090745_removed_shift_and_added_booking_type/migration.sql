/*
  Warnings:

  - You are about to drop the column `shift` on the `Booking` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('Online', 'OTC');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "shift",
ADD COLUMN     "bookingType" "BookingType" DEFAULT 'Online';
