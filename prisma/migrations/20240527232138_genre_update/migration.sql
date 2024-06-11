-- CreateTable
CREATE TABLE "Genre" (
    "genre" TEXT NOT NULL,
    "genreName" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("genre")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "videoNo" INTEGER NOT NULL,
    "tiktokVideoLink" TEXT NOT NULL,
    "songName" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "albumName" TEXT NOT NULL,
    "videoLength" TEXT NOT NULL,
    "YesNo" BOOLEAN NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongGenre" (
    "songId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "SongGenre_pkey" PRIMARY KEY ("songId","genreId")
);

-- AddForeignKey
ALTER TABLE "SongGenre" ADD CONSTRAINT "SongGenre_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongGenre" ADD CONSTRAINT "SongGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("genre") ON DELETE RESTRICT ON UPDATE CASCADE;
