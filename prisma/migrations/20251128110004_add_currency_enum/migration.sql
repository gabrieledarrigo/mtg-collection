/*
  Warnings:

  - The `currency` column on the `purchases` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR');

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'EUR';
