/*
  Warnings:

  - You are about to drop the `Facility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hotel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Facility" DROP CONSTRAINT "Facility_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_hotelId_fkey";

-- DropTable
DROP TABLE "Facility";

-- DropTable
DROP TABLE "Hotel";
