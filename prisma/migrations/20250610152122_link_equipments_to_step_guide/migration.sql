/*
  Warnings:

  - You are about to drop the column `steps` on the `guides` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "guides" DROP COLUMN "steps",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "user_id" DROP DEFAULT;

-- CreateTable
CREATE TABLE "steps" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "hint" TEXT,
    "note" TEXT,
    "advice" TEXT,
    "benefit" TEXT,
    "image_url" TEXT,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "guide_id" TEXT NOT NULL,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_step_equipment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_step_equipment_AB_unique" ON "_step_equipment"("A", "B");

-- CreateIndex
CREATE INDEX "_step_equipment_B_index" ON "_step_equipment"("B");

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_step_equipment" ADD CONSTRAINT "_step_equipment_A_fkey" FOREIGN KEY ("A") REFERENCES "equipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_step_equipment" ADD CONSTRAINT "_step_equipment_B_fkey" FOREIGN KEY ("B") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
