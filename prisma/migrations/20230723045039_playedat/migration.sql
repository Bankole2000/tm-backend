/*
  Warnings:

  - Added the required column `playedAt` to the `SongRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SongRequest" ADD COLUMN     "playedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "requestedBy" SET DEFAULT 'Anonymous';
