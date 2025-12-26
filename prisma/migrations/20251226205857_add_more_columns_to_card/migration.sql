/*
  Warnings:

  - Added the required column `scryfall_uri` to the `cards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `set_name` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "artist" TEXT,
ADD COLUMN     "flavor_text" TEXT,
ADD COLUMN     "scryfall_uri" TEXT NOT NULL,
ADD COLUMN     "set_name" TEXT NOT NULL;
