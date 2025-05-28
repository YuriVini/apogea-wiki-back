-- CreateTable
CREATE TABLE "builds" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "builds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "range" TEXT,
    "size" TEXT,
    "damage" TEXT,
    "defense" TEXT,
    "attributes" TEXT,
    "weight" TEXT,
    "drop_by" TEXT,
    "rarity" TEXT,
    "sell_to" TEXT,
    "buy_from" TEXT,
    "attack_speed" TEXT,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "build_id" TEXT NOT NULL,

    CONSTRAINT "requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_stats" (
    "id" TEXT NOT NULL,
    "mana" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "magic" INTEGER NOT NULL,
    "hp_regen" INTEGER NOT NULL,
    "mp_regen" INTEGER NOT NULL,
    "health" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "weapon_skill" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "pvp_status" TEXT NOT NULL,
    "build_id" TEXT NOT NULL,

    CONSTRAINT "character_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategies" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "build_id" TEXT NOT NULL,

    CONSTRAINT "strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_build_equipment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_main_skills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_support_skills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "character_stats_build_id_key" ON "character_stats"("build_id");

-- CreateIndex
CREATE UNIQUE INDEX "_build_equipment_AB_unique" ON "_build_equipment"("A", "B");

-- CreateIndex
CREATE INDEX "_build_equipment_B_index" ON "_build_equipment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_main_skills_AB_unique" ON "_main_skills"("A", "B");

-- CreateIndex
CREATE INDEX "_main_skills_B_index" ON "_main_skills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_support_skills_AB_unique" ON "_support_skills"("A", "B");

-- CreateIndex
CREATE INDEX "_support_skills_B_index" ON "_support_skills"("B");

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirements" ADD CONSTRAINT "requirements_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "builds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_stats" ADD CONSTRAINT "character_stats_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "builds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "builds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_build_equipment" ADD CONSTRAINT "_build_equipment_A_fkey" FOREIGN KEY ("A") REFERENCES "builds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_build_equipment" ADD CONSTRAINT "_build_equipment_B_fkey" FOREIGN KEY ("B") REFERENCES "equipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_main_skills" ADD CONSTRAINT "_main_skills_A_fkey" FOREIGN KEY ("A") REFERENCES "builds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_main_skills" ADD CONSTRAINT "_main_skills_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_support_skills" ADD CONSTRAINT "_support_skills_A_fkey" FOREIGN KEY ("A") REFERENCES "builds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_support_skills" ADD CONSTRAINT "_support_skills_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
