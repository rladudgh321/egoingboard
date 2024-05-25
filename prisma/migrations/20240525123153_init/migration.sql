/*
  Warnings:

  - You are about to drop the column `userId` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshTokenId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshTokenId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropIndex
DROP INDEX "RefreshToken_userId_key";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "userId",
ADD COLUMN     "refreshTokenId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_refreshTokenId_key" ON "RefreshToken"("refreshTokenId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_refreshTokenId_fkey" FOREIGN KEY ("refreshTokenId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
