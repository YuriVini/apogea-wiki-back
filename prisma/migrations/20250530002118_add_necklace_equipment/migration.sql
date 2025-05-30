/*
  Warnings:

  - Added the required column `necklace_id` to the `builds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "builds" ADD COLUMN     "necklace_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_necklace_id_fkey" FOREIGN KEY ("necklace_id") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
