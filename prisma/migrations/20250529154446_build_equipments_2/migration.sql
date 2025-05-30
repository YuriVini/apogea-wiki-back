/*
  Warnings:

  - You are about to drop the column `slot` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the `_build_equipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_main_skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_support_skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `character_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requirements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `strategies` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `characterStats` to the `builds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strategy` to the `builds` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_build_equipment" DROP CONSTRAINT "_build_equipment_A_fkey";

-- DropForeignKey
ALTER TABLE "_build_equipment" DROP CONSTRAINT "_build_equipment_B_fkey";

-- DropForeignKey
ALTER TABLE "_main_skills" DROP CONSTRAINT "_main_skills_A_fkey";

-- DropForeignKey
ALTER TABLE "_main_skills" DROP CONSTRAINT "_main_skills_B_fkey";

-- DropForeignKey
ALTER TABLE "_support_skills" DROP CONSTRAINT "_support_skills_A_fkey";

-- DropForeignKey
ALTER TABLE "_support_skills" DROP CONSTRAINT "_support_skills_B_fkey";

-- DropForeignKey
ALTER TABLE "character_stats" DROP CONSTRAINT "character_stats_build_id_fkey";

-- DropForeignKey
ALTER TABLE "requirements" DROP CONSTRAINT "requirements_build_id_fkey";

-- DropForeignKey
ALTER TABLE "strategies" DROP CONSTRAINT "strategies_build_id_fkey";

-- AlterTable
ALTER TABLE "builds" ADD COLUMN     "accessory_id" TEXT,
ADD COLUMN     "backpack_id" TEXT,
ADD COLUMN     "boots_id" TEXT,
ADD COLUMN     "characterStats" TEXT NOT NULL,
ADD COLUMN     "chest_id" TEXT,
ADD COLUMN     "helmet_id" TEXT,
ADD COLUMN     "left_hand_id" TEXT,
ADD COLUMN     "right_hand_id" TEXT,
ADD COLUMN     "ring_id" TEXT,
ADD COLUMN     "strategy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "equipments" DROP COLUMN "slot";

-- DropTable
DROP TABLE "_build_equipment";

-- DropTable
DROP TABLE "_main_skills";

-- DropTable
DROP TABLE "_support_skills";

-- DropTable
DROP TABLE "character_stats";

-- DropTable
DROP TABLE "requirements";

-- DropTable
DROP TABLE "skills";

-- DropTable
DROP TABLE "strategies";

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_ring_id_fkey" FOREIGN KEY ("ring_id") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_boots_id_fkey" FOREIGN KEY ("boots_id") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_chest_id_fkey" FOREIGN KEY ("chest_id") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_helmet_id_fkey" FOREIGN KEY ("helmet_id") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_left_hand_id_fkey" FOREIGN KEY ("left_hand_id") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_backpack_id_fkey" FOREIGN KEY ("backpack_id") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_right_hand_id_fkey" FOREIGN KEY ("right_hand_id") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
