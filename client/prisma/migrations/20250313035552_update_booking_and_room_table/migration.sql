/*
  Warnings:

  - You are about to drop the column `numberOfGuests` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `name` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfAdults` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfChildren` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomNumber` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shift` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomRate` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "numberOfGuests",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "numberOfAdults" INTEGER NOT NULL,
ADD COLUMN     "numberOfChildren" INTEGER NOT NULL,
ADD COLUMN     "roomNumber" TEXT NOT NULL,
ADD COLUMN     "shift" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "roomRate" INTEGER NOT NULL;
