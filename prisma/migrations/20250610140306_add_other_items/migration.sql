-- CreateTable
CREATE TABLE "other_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image_url" TEXT,
    "weight" TEXT,
    "sell_to" TEXT,
    "drop_by" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "hp" TEXT,
    "exp" TEXT,
    "abilities" TEXT,
    "loot" TEXT,
    "author" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "text" TEXT,
    "buffs" TEXT,
    "satiate_time" TEXT,
    "requirements" TEXT,
    "npc_location" TEXT,

    CONSTRAINT "other_items_pkey" PRIMARY KEY ("id")
);
