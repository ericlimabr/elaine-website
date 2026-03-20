/*
  Warnings:

  - The primary key for the `GlobalSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "GlobalSettings" DROP CONSTRAINT "GlobalSettings_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id");
