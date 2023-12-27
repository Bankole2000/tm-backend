import PerformanceService from '../services/performance.service';
import { ServiceResponse } from '../@types/ServiseReponse.type';
import {Request, Response} from 'express';

const performanceService = new PerformanceService();
const performanceFields = ['videoNumber', 'videoURL', 'songName', 'artistName', 'albumName', 'yesOrNo', 'videoLength', 'mainGenre', 'subGenre', 'otherGenres']

export const searchPerformanceHandler = async (req: Request, res: Response) => {
  const { q: searchTerm, mainGenre } = req.query;
  let filters: { [key: string]: any } = {};
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
  if(mainGenre) {
    if (mainGenre.toString().includes(",")) {
      filters.mainGenre = {
        in: mainGenre.toString().split(",")
      };
    } else {
      filters.mainGenre = mainGenre as string;
    }
  }
  console.log({filters});
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
  console.log({data, body: req.body});
  let sr: ServiceResponse;
  if(!Array.isArray(data)){
    sr = new ServiceResponse('Invalid data sent', req.body, false, 400, 'Invalid data', 'Invalid data', 'check data and try again', null)
  }
  sr = await performanceService.batchAddPerformances(data)
  return res.status(sr.statusCode).send(sr)
}

export const getGenresHandler = async (req: Request, res: Response) => {
  const sr = await performanceService.getGenres()
  return res.status(sr.statusCode).send(sr);
}