/*
  Warnings:

  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Reserved', 'Unconfirmed');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Unconfirmed',
ALTER COLUMN "shift" DROP NOT NULL;
