import { Request, Response } from 'express';
import { ServiceResponse } from '../@types/ServiseReponse.type';
import { getIO } from '../lib/socketIO';
import JSONSongs from "../utils/data/new/keysdata.json";
import { newUpdateData } from 'utils/helpers/default';


export const defaultHandler = async (_req: Request, res: Response) => {
  const sr = new ServiceResponse('Not yet implemented', null, true, 200, null, null, null);
  return res.status(sr.statusCode).send(sr);
};

export const routeNotFoundHandler = async (req: Request, res: Response) => {
  const sr = new ServiceResponse('Route not found', null, false, 404, 'Not found', `Cannot ${req.method} ${req.originalUrl}`, 'Check that endpoint exists and has a handler');
  getIO().emit("ROUTE_NOT_FOUND", sr);
  return res.status(sr.statusCode).send(sr);
};

export const getExcelFileSongs = async (req: Request, res: Response) => {
  res.status(200).send(JSONSongs['Sheet1']);
}

export const setDefaultSongData = async (req: Request, res: Response) => {
  await newUpdateData()
  res.status(200).send({message: "default data stored"})
}