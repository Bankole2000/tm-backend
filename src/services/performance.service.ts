import { Prisma, PrismaClient } from "@prisma/client";
import { ServiceResponse } from "../@types/ServiseReponse.type";
import prisma from "../lib/prisma";

export default class PerformanceService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = prisma
  }

  async addPerformance(performance: Prisma.PerformanceCreateInput) {
    try {
      const newPerformance = await this.prisma.performance.create({
        data: performance
      })
      return new ServiceResponse(
        'Performance added', 
        newPerformance,
        true, 
        200,
        null,
        null,
        null,
        null
      )
    } catch (error: any) {
      console.log({error})
      return new ServiceResponse('Error adding performance', null, false, 500, error.message, error, 'Check logs and database', null);
    }
  }

  async getPerformances(page = 1, limit = 25){
    try {
      const performances = await this.prisma.performance.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          songName: 'asc'
        }
      })
      const total = await this.prisma.performance.count();
      const pages = Math.ceil(total / limit) || 1;
      const prev = pages > 1 && page <= pages && page > 0 ? page - 1 : null;
      const next = pages > 1 && page < pages && page > 0 ? page + 1 : null;
      return new ServiceResponse(
        'Performances',
        {
          data: performances, pages, page, prev, next, total, limit
        },
        true,
        200,
        null,
        null,
        null
      )
    } catch (error: any) {
      console.log({ error })
      return new ServiceResponse('Error getting performances', null, false, 500, error.message, error, 'Check logs and database');
    }
  }

  async searchPerformances(searchTerm: string, page = 1, limit = 25, filter = {}){
    try {
      let data, total;
      if(Object.keys(filter).length && searchTerm){
        data = await this.prisma.performance.findMany({
          take: limit,
          skip: (page - 1) * limit,
          where: {
            OR: [
              {
                songName: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                artistName: {
                  contains: searchTerm,
                  mode: 'insensitive',
                }
              },
              {
                albumName: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ],
            AND: {
              ...filter
            }
          }
        })
        total = await this.prisma.performance.count({
          where: {
            OR: [
              {
                songName: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                artistName: {
                  contains: searchTerm,
                  mode: 'insensitive',
                }
              },
              {
                albumName: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ],
            AND: {
              ...filter
            }
          }
        })
      } else if (!Object.keys(filter).length && searchTerm) {
        data = await this.prisma.performance.findMany({
          take: limit,
          skip: (page - 1) * limit,
          where: {
            OR: [
              {
                songName: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                artistName: {
                  contains: searchTerm,
                  mode: 'insensitive',
                }
              },
              {
                albumName: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ],
          }
        })
        total = await this.prisma.performance.count({
          where: {
            OR: [
              {
                songName: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                artistName: {
                  contains: searchTerm,
                  mode: 'insensitive',
                }
              },
              {
                albumName: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ],
          }
        })
      } else {
        data = await this.prisma.performance.findMany({
          take: limit,
          skip: (page - 1) * limit,
          where: {
            ...filter
          }
        })
        total = await this.prisma.performance.count({
          where: {
            ...filter
          }
        })
      }
      const pages = Math.ceil(total / limit) || 1;
      const prev = pages > 1 && page <= pages && page > 0 ? page - 1 : null;
      const next = pages > 1 && page < pages && page > 0 ? page + 1 : null;
      return new ServiceResponse(
        `Performances`,
        {
          data, pages, page, prev, next, total, limit
        },
        true,
        200,
        null,
        null,
        null
      )
    } catch (error: any) {
      console.log({error})
      return new ServiceResponse('Error searching song requests', null, false, 500, error.message, error, 'Check logs and database');
    }
  }

  async getPerformanceById(id: string){
    try {
      const performance = this.prisma.performance.findUnique({
        where: {
          id
        }
      })
      if(!performance){
        return new ServiceResponse('Not found', performance, false, 404, 'Not found', 'notFound', 'Check logs and database', null)
      }
      return new ServiceResponse(
        'Performance found',
        performance,
        true,
        200,
        null,
        null,
        null,
        null
      )
    } catch (error: any) {
      console.log({error})
      return new ServiceResponse(
        'Error getting performance record',
        null,
        false,
        500,
        error.message,
        error,
        'Check logs and database',
        null
      )
    }
  }

  async updatePerformance(id: string, performanceData: Prisma.PerformanceUpdateInput) {
    try {
      const updatedPerformance = await this.prisma.performance.update({
        where: {
          id
        },
        data: {
          ...performanceData
        }
      })
      return new ServiceResponse(
        'performance updated',
        updatedPerformance,
        true,
        200,
        null,
        null,
        null,
        null
      ) 
    } catch (error: any) {
      console.log({ error })
      return new ServiceResponse('Error updating performances', null, false, 500, error.message, error, 'Check logs and database');
    }
  }

  async deletePerformance(id: string) {
    try {
      const updatedPerformance = await this.prisma.performance.delete({
        where: {
          id
        },
      })
      return new ServiceResponse(
        'performance deleted',
        updatedPerformance,
        true,
        200,
        null,
        null,
        null,
        null
      ) 
    } catch (error: any) {
      console.log({ error })
      return new ServiceResponse('Error deleting performances', null, false, 500, error.message, error, 'Check logs and database');
    }
  }

  async batchAddPerformances(performanceData: Prisma.PerformanceCreateManyInput) {
    console.log({performanceData})
    try {
      const createCount = await this.prisma.performance.createMany({
        data: performanceData
      })
      return new ServiceResponse(
        'Performances created',
        createCount,
        true,
        200,
        null,
        null,
        null,
        null
      )
    } catch (error: any) {
      console.log({error})
      return new ServiceResponse('Error updating performances', null, false, 500, error.message, error, 'Check logs and database');
    }
  }
}