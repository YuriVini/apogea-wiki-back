-- AlterTable
ALTER TABLE "builds" ADD COLUMN     "legs_id" TEXT;

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_legs_id_fkey" FOREIGN KEY ("legs_id") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
