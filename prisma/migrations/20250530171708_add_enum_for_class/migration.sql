/*
  Warnings:

  - Changed the type of `character_class` on the `builds` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CharacterClass" AS ENUM ('Knight', 'Mage', 'Squire', 'Rogue');

-- AlterTable
ALTER TABLE "builds" DROP COLUMN "character_class",
ADD COLUMN     "character_class" "CharacterClass" NOT NULL;
