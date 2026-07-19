/*
  Warnings:

  - You are about to drop the column `source_order_id` on the `purchases` table. All the data in the column will be lost.
  - Added the required column `order_id` to the `purchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "source_order_id",
ADD COLUMN     "order_id" TEXT NOT NULL;
