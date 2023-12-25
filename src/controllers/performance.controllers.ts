import PerformanceService from '../services/performance.service';
import { ServiceResponse } from '../@types/ServiseReponse.type';
import {Request, Response} from 'express';

const performanceService = new PerformanceService();
const performanceFields = ['videoNumber', 'videoURL', 'songName', 'artistName', 'albumName', 'yesOrNo', 'videoLength', 'mainGenre', 'subGenre', 'otherGenres']
const searchFilterFields = ['']

export const searchPerformanceHandler = async (req: Request, res: Response) => {
  const { q: searchTerm } = req.query;
  
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
}

export const deletePerformanceHandler = async (req: Request, res: Response) => {

}

export const addBatchPerformanceHandler = async (req: Request, res: Response) => {

}