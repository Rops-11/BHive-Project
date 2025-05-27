/*
  Warnings:

  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'Pending';

-- DropTable
DROP TABLE "Staff";
