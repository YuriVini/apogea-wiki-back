-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "RoleType" NOT NULL DEFAULT 'USER';
