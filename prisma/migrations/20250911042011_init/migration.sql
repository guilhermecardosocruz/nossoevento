/*
  Warnings:

  - You are about to drop the column `startsAt` on the `Event` table. All the data in the column will be lost.
  - Added the required column `startAt` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "startsAt",
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;
