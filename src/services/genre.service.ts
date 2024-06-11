import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";

export class GenreService {
  private prisma: PrismaClient

  constructor(){
    this.prisma = prisma
  }

  async batchCreateGenres(batchData: any){
    try {
      const result = await this.prisma.genre.createMany({
        data: [
          ...batchData
        ],
        skipDuplicates: true,
      });
      console.log(`${result.count} genres created`);
      return result;
    } catch (error: any) {
      console.log({error});
    }
  }

  async createSong(songData: any){
    try {
      const song = await this.prisma.song.create({
        data: {
          ...songData
        }
      })
      console.log(`song created - ${songData.songName}`);
    } catch (error: any) {
      console.log({error});
    }
  }

  async batchCreateSongs(batchSongData: any){
    try {
      const result = await this.prisma.song.createMany({
        data: [
          ...batchSongData
        ],
        skipDuplicates: true,
      })
      console.log(`${result.count} songs created`);
    } catch (error: any) {
      console.log({error});
    }
  }

  async linkSongGenre(songId: any, genreId: any){
    try {
      const songGenre = await this.prisma.songGenre.create({
        data: {
          genreId,
          songId
        }
      })
      console.log("Song Genre created");
    } catch (error: any) {
      console.log({error});
    }
  }

  async batchLinkSongGenre(batchSongGenreData: any) {
    try {
      const result = await this.prisma.songGenre.createMany({
        data: [
          ...batchSongGenreData
        ],
        skipDuplicates: true
      })
      console.log(`${result.count} Song genres linked`);
    } catch (error: any) {
      console.log({error});
    }
  }

  async countAll(){
    try {
      const [songCount, genreCount, songGenreCount] = await this.prisma.$transaction([
        this.prisma.song.count(),
        this.prisma.genre.count(),
        this.prisma.songGenre.count()
      ])
      return {songCount, genreCount, songGenreCount}
    } catch (error: any) {
      console.log({error});
    }
  }
}