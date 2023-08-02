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

  async findSongRequestById(requestId: string) {
    try {
      const songRequest = await this.prisma.songRequest.findUnique({
        where: {
          id: requestId
        }
      })
      if (songRequest){
        return new ServiceResponse('Song request found', songRequest, true, 200, null, null, null);
      }
      return new ServiceResponse('Song request not found', songRequest, false, 404, 'Song Request not found', 'NOT_FOUND', 'Check that the song request exists');
    } catch (error: any) {
      console.log({ error });
      return new ServiceResponse('Error finding song request', null, false, 500, error.message, error, 'Check logs and database');
    }
  }

  async togglePlayedStatus(requestId: string, hasBeenPlayed = true ){
    try {
      const updatedRequest = await this.prisma.songRequest.update({
        where: {
          id: requestId,
        },
        data: {
          hasBeenPlayed
        }
      })
      return new ServiceResponse(`Song Request ${updatedRequest.hasBeenPlayed ? 'played': 'not yet played'}`, updatedRequest, true, 201, null, null, null);
    } catch (error: any) {
      console.log({ error });
      return new ServiceResponse('Error updating song request', null, false, 500, error.message, error, 'Check logs and database');
    }
  }

  async updateSongRequest(requestId: string, data: Prisma.SongRequestUpdateInput){
    try {
      const updatedRequest = await this.prisma.songRequest.update({
        where: {
          id: requestId,
        },
        data: {
          ...data
        }
      })
      return new ServiceResponse('Song Request updated', updatedRequest, true, 201, null, null, null);
    } catch (error: any) {
      console.log({ error });
      return new ServiceResponse('Error updating song request', null, false, 500, error.message, error, 'Check logs and database');
    }
  }

  async deleteSongRequest(requestId: string) {
    try {
      const deletedRequest = await this.prisma.songRequest.delete({
        where: {
          id: requestId,
        }
      })
      return new ServiceResponse('Song request deleted', deletedRequest, true, 201, null, null, null);
    } catch (error: any) {
      console.log({ error })
      return new ServiceResponse('Error deleting song request', null, false, 500, error.message, error, 'Check logs and database');
    }
  }

  async getSongRequests(page = 1, limit = 25) {
    try {
      const songRequests = await this.prisma.songRequest.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          requestedAt: 'desc'
        }
      })
      const total = await this.prisma.songRequest.count();
      const pages = Math.ceil(total / limit) || 1;
      const prev = pages > 1 && page <= pages && page > 0 ? page - 1 : null;
      const next = pages > 1 && page < pages && page > 0 ? page + 1 : null;
      return new ServiceResponse(
        'Song Requests',
        {
          data: songRequests, pages, page, prev, next, total, limit
        },
        true,
        200,
        null,
        null,
        null
      )
    } catch (error: any) {
      console.log({ error })
      return new ServiceResponse('Error getting song request', null, false, 500, error.message, error, 'Check logs and database');
    }
  }

  async getSongRequestsByStatus(hasBeenPlayed: boolean, page = 1, limit = 25) {
    try {
      const songRequests = await this.prisma.songRequest.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          hasBeenPlayed
        },
        orderBy: {
          requestedAt: 'desc'
        }
      })
      const total = await this.prisma.songRequest.count({
        where: {
          hasBeenPlayed
        }
      });
      const pages = Math.ceil(total / limit) || 1;
      const prev = pages > 1 && page <= pages && page > 0 ? page - 1 : null;
      const next = pages > 1 && page < pages && page > 0 ? page + 1 : null;
      return new ServiceResponse(
        `${hasBeenPlayed ? 'Played': 'Unplayed'} Song Requests`,
        {
          data: songRequests, pages, page, prev, next, total, limit
        },
        true,
        200,
        null,
        null,
        null
      )
    } catch (error: any) {
      console.log({ error })
      return new ServiceResponse('Error getting song request', null, false, 500, error.message, error, 'Check logs and database');
    }
  }

  async searchSongRequests(searchTerm: string, page = 1, limit = 25) {
    try {
      const songRequests = await this.prisma.songRequest.findMany({
        where: {
          OR: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              artist: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              requestedBy: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            }
          ]
        },
        orderBy: {
          requestedAt: 'desc'
        }
      });
      const total = await this.prisma.songRequest.count({
        where: {
          OR: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              artist: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              requestedBy: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            }
          ]
        }
      });
      const pages = Math.ceil(total / limit) || 1;
      const prev = pages > 1 && page <= pages && page > 0 ? page - 1 : null;
      const next = pages > 1 && page < pages && page > 0 ? page + 1 : null;
      return new ServiceResponse(
        `Song Requests containing "${searchTerm}"`,
        {
          data: songRequests, pages, page, prev, next, total, limit, searchTerm
        },
        true,
        200,
        null,
        null,
        null
      );
    } catch (error: any) {
      console.log({ error })
      return new ServiceResponse('Error searching song requests', null, false, 500, error.message, error, 'Check logs and database');
    }
  }

  async searchSongRequestsByStatus(hasBeenPlayed: boolean, searchTerm: string, page = 1, limit = 25) {
    try {
      const songRequests = await this.prisma.songRequest.findMany({
        where: {
          OR: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              artist: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              requestedBy: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            }
          ],
          AND: {
            hasBeenPlayed
          }
        },
        orderBy: {
          requestedAt: 'desc'
        }
      });
      const total = await this.prisma.songRequest.count({
        where: {
          OR: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              artist: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              requestedBy: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            }
          ],
          AND: {
            hasBeenPlayed
          }
        }
      });
      const pages = Math.ceil(total / limit) || 1;
      const prev = pages > 1 && page <= pages && page > 0 ? page - 1 : null;
      const next = pages > 1 && page < pages && page > 0 ? page + 1 : null;
      return new ServiceResponse(
        `${hasBeenPlayed ? 'Played': 'Unplayed'} Song Requests containing "${searchTerm}"`,
        {
          data: songRequests, pages, page, prev, next, total, limit, searchTerm
        },
        true,
        200,
        null,
        null,
        null
      );
    } catch (error: any) {
      console.log({ error })
      return new ServiceResponse('Error searching song requests', null, false, 500, error.message, error, 'Check logs and database');
    }
  }
  
  // async getPendingSongRequests()
}