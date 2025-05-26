-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Paid', 'Partial');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'Partial';
