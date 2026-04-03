/*
  Warnings:

  - You are about to alter the column `cmc` on the `cards` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "cards" ALTER COLUMN "cmc" SET DATA TYPE DOUBLE PRECISION;
