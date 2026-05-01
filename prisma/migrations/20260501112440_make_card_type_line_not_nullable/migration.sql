/*
  Warnings:

  - Made the column `type_line` on table `cards` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cards" ALTER COLUMN "type_line" SET NOT NULL;
