/*
  Warnings:

  - You are about to drop the column `downPayment` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "downPayment",
ALTER COLUMN "paymentStatus" SET DEFAULT 'Paid';
