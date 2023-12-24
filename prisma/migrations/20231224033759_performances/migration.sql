-- AlterTable
ALTER TABLE "SongRequest" ALTER COLUMN "playedAt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Performance" (
    "id" TEXT NOT NULL,
    "videoNumber" INTEGER DEFAULT 1,
    "videoURL" TEXT,
    "songName" TEXT,
    "artistName" TEXT,
    "albumName" TEXT,
    "yesOrNo" BOOLEAN DEFAULT false,
    "videoLength" TEXT,
    "videoLengthInSeconds" INTEGER NOT NULL DEFAULT 1,
    "mainGenre" TEXT,
    "subGenre" TEXT,
    "otherGenres" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Performance_pkey" PRIMARY KEY ("id")
);
