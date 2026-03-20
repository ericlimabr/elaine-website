/*
  Warnings:

  - Added the required column `authorName` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "authorName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
