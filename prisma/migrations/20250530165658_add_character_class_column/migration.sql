/*
  Warnings:

  - You are about to drop the column `characterStats` on the `builds` table. All the data in the column will be lost.
  - Added the required column `character_class` to the `builds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `character_stats` to the `builds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "builds" DROP COLUMN "characterStats",
ADD COLUMN     "character_class" TEXT NOT NULL,
ADD COLUMN     "character_stats" TEXT NOT NULL;
