-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'MYTHIC');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('MINT', 'NEAR_MINT', 'EXCELLENT', 'GOOD', 'LIGHT_PLAYED', 'PLAYED', 'POOR');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'ES', 'FR', 'DE', 'IT', 'PT', 'JA', 'KO', 'RU', 'ZHS', 'ZHT', 'HE', 'LA', 'GRC', 'AR', 'SA', 'PH');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('CARDTRADER', 'DIRECT_PURCHASE', 'TRADE', 'GIFT', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "scryfall_id" UUID NOT NULL,
    "oracle_id" UUID,
    "name" TEXT NOT NULL,
    "set_code" TEXT NOT NULL,
    "collector_number" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "type_line" TEXT,
    "image_url_small" TEXT,
    "image_url_normal" TEXT,
    "image_url_large" TEXT,
    "oracle_text" TEXT,
    "printed_name" TEXT,
    "printed_type_line" TEXT,
    "printed_text" TEXT,
    "mana_cost" TEXT,
    "cmc" DECIMAL(4,2) NOT NULL DEFAULT 0,
    "color_identity" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "layout" TEXT NOT NULL DEFAULT 'normal',
    "card_faces" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_items" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "foil" BOOLEAN NOT NULL,
    "condition" "Condition" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "collection_item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price_per_card" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "source" "Source" NOT NULL DEFAULT 'CARDTRADER',
    "source_order_id" TEXT NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cards_scryfall_id_key" ON "cards"("scryfall_id");

-- CreateIndex
CREATE INDEX "idx_set_code" ON "cards"("set_code");

-- CreateIndex
CREATE UNIQUE INDEX "cards_set_code_collector_number_language_key" ON "cards"("set_code", "collector_number", "language");

-- CreateIndex
CREATE INDEX "idx_user_id" ON "collection_items"("user_id");

-- CreateIndex
CREATE INDEX "idx_card_id" ON "collection_items"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "collection_items_user_id_card_id_foil_condition_key" ON "collection_items"("user_id", "card_id", "foil", "condition");

-- CreateIndex
CREATE INDEX "purchases_collection_item_id_idx" ON "purchases"("collection_item_id");

-- CreateIndex
CREATE INDEX "purchases_purchased_at_idx" ON "purchases"("purchased_at");

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_collection_item_id_fkey" FOREIGN KEY ("collection_item_id") REFERENCES "collection_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
