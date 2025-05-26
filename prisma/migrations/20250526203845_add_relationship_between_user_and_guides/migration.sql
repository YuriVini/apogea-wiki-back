-- AlterTable
ALTER TABLE "guides" ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "guides" ADD CONSTRAINT "guides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
