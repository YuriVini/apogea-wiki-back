/*
  Warnings:

  - Made the column `accessory_id` on table `builds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `backpack_id` on table `builds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `boots_id` on table `builds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chest_id` on table `builds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `helmet_id` on table `builds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `left_hand_id` on table `builds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `right_hand_id` on table `builds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ring_id` on table `builds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `legs_id` on table `builds` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "builds" ALTER COLUMN "accessory_id" SET NOT NULL,
ALTER COLUMN "backpack_id" SET NOT NULL,
ALTER COLUMN "boots_id" SET NOT NULL,
ALTER COLUMN "chest_id" SET NOT NULL,
ALTER COLUMN "helmet_id" SET NOT NULL,
ALTER COLUMN "left_hand_id" SET NOT NULL,
ALTER COLUMN "right_hand_id" SET NOT NULL,
ALTER COLUMN "ring_id" SET NOT NULL,
ALTER COLUMN "legs_id" SET NOT NULL;
