import PerformanceService from '../services/performance.service';
import { ServiceResponse } from '../@types/ServiseReponse.type';
import {Request, Response} from 'express';
import { Prisma } from '@prisma/client';
import { isBoolean } from '../utils/helpers/validators';

const performanceService = new PerformanceService();
const performanceFields = ['videoNumber', 'videoURL', 'songName', 'artistName', 'albumName', 'yesOrNo', 'videoLength', 'mainGenre', 'subGenre', 'otherGenres', 'uploadDate' ]

export const searchPerformanceHandler = async (req: Request, res: Response) => {
  const { q: searchTerm, genres } = req.query;
  let filters: Prisma.SongWhereInput = {};
  let limit: number;
  let page: number;
  let sr: ServiceResponse;
  if (parseInt(req.query.limit as string, 10)) {
    limit = parseInt(req.query.limit as string, 10);
  } else {
    limit = 25;
  }
  if (parseInt(req.query.page as string, 10)) {
    page = parseInt(req.query.page as string, 10);
  } else {
    page = 1;
  }
  if(genres) {
    if (genres.toString().includes(",")) {
      const reqGenres = genres.toString().split(",");
      filters = {
        songGenres: {some: {genreId: {in: reqGenres}}}
      };
    } else {
      filters = {
        songGenres: {some: {genreId: {contains: genres.toString()}}}
      };
    }
  }
  sr = await performanceService.searchPerformances(searchTerm as string || '', page, limit, filters)
  return res.status(sr.statusCode).send(sr);
}

export const getPerformancesHandler = async (req: Request, res: Response) => {
  let limit: number;
  let page: number;
  let sr: ServiceResponse;
  if (parseInt(req.query.limit as string, 10)) {
    limit = parseInt(req.query.limit as string, 10);
  } else {
    limit = 25;
  }
  if (parseInt(req.query.page as string, 10)) {
    page = parseInt(req.query.page as string, 10);
  } else {
    page = 1;
  }
  sr = await performanceService.getPerformances(page, limit);
  return res.status(sr.statusCode).send(sr);
}

export const addPerformanceHandler = async (req: Request, res: Response) => {
  const performanceData: { [key: string]: string } = {};
  performanceFields.forEach(field => {
    if(req.body[field]){
      performanceData[field] = req.body[field]
    }
  })
  const sr = await performanceService.addPerformance(performanceData);
  return res.status(sr.statusCode).send(sr);
}

export const updatePerformanceHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const performanceData: { [key: string]: string } = {};
  performanceFields.forEach(field => {
    if(req.body[field]){
      performanceData[field] = req.body[field]
    }
  })
  const sr = await performanceService.updatePerformance(id, performanceData);
  return res.status(sr.statusCode).send(sr);
}

export const deletePerformanceHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const sr = await performanceService.deletePerformance(id);
  return res.status(sr.statusCode).send(sr);
}

export const addBatchPerformanceHandler = async (req: Request, res: Response) => {
  const data = req.body.data;
  let sr: ServiceResponse;
  if(!Array.isArray(data)){
    sr = new ServiceResponse('Invalid data sent', req.body, false, 400, 'Invalid data', 'Invalid data', 'check data and try again', null)
  }
  sr = await performanceService.batchAddPerformances(data)
  return res.status(sr.statusCode).send(sr)
}

export const getGenresHandler = async (req: Request, res: Response) => {
  const sr = await performanceService.getNewGenres()
  return res.status(sr.statusCode).send(sr);
}

// Replace the addSongHandler function in src/controllers/performance.controllers.ts
export const addSongHandler = async (req: Request, res: Response) => {
  const ppgs = new PerformanceService()
  const fields = ['videoNo', 'tiktokVideoLink', 'songName', 'artistName', 'albumName', 'spotifyId', 'videoLength', 'YesNo', 'songGenres', 'audioUrl']
  const createData: {[key: string]: any} = {};
  
  fields.forEach(f => {
    if (req.body[f]){
      if(f === 'videoNo'){
        createData[f] = Number(req.body[f])
      } else {
        createData[f] = req.body[f]
      }
    }
    if(isBoolean(req.body[f])){
      createData[f] = req.body[f]
    }
  })

  // Auto-generate audioUrl if not provided but tiktokVideoLink exists
  if (!createData.audioUrl && createData.tiktokVideoLink) {
    try {
      // Extract video ID from TikTok URL
      const tiktokUrl = createData.tiktokVideoLink;
      const match = tiktokUrl.match(/\/video\/(\d+)/);
      
      if (match && match[1]) {
        const videoId = match[1];
        createData.audioUrl = `https://pub-b8c2ac03cc924dd08beda93e65075aa1.r2.dev/${videoId}.mp3`;
        console.log(`Auto-generated audioUrl: ${createData.audioUrl}`);
      } else {
        console.log(`Could not extract video ID from TikTok URL: ${tiktokUrl}`);
      }
    } catch (error) {
      console.error('Error generating audioUrl:', error);
      // Continue without audioUrl if extraction fails
    }
  }

  const sr = await ppgs.addSong(createData);
  return res.status(sr.statusCode).send(sr)
}