import { Prisma, PrismaClient } from '@prisma/client';
import { ServiceResponse } from '../@types/ServiseReponse.type';
import prisma from '../lib/prisma';

export default class SongRequestService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async addSongRequest(songRequest: Prisma.SongRequestCreateInput) {
    try {
      const newSongRequest = await this.prisma.songRequest.create({
        data: songRequest
      })
      return new ServiceResponse('Song Request Added', newSongRequest, true, 201, null, null, null);
    } catch (error: any) {
      console.log({ error });
      return new ServiceResponse('Error adding song request', null, false, 500, error.message, error, 'Check logs and database');
    }
  }
  
  // async getPendingSongRequests()
}