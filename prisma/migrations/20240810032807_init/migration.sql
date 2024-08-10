/*
  Warnings:

  - The `role` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Staff');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'Staff';
