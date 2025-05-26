/*
  Warnings:

  - You are about to drop the column `id_document` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_id_document_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "id_document";
