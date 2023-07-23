import { Request, Response } from 'express';
import { ServiceResponse } from '../@types/ServiseReponse.type';
import SongRequestService from '../services/songRequest.service';
import { getIO } from '../lib/socketIO';
import { songRequestFields } from '../utils/validators/songRequest.schema';
import { Prisma } from '@prisma/client';

const songService = new SongRequestService();

export const addSongRequestHandler = async (req: Request, res: Response) => {
  const requestData: { [key: string]: string } = {};
  songRequestFields.forEach(field => {
    if(req.body[field]){
      requestData[field] = req.body[field]
    }
  })
  const sr = await songService.addSongRequest(requestData as unknown as Prisma.SongRequestCreateInput);
  if(sr.success){
    getIO().emit('SONG_REQUEST_ADDED', sr.data);
  }
  return res.status(sr.statusCode).send(sr);
};

export const togglePlayedStatusHandler = async (req: Request, res: Response) => {
  const { hasBeenPlayed } = req.body;
  const { id } = req.params;
  const foundRequest = await songService.findSongRequestById(id);
  if(!foundRequest.success || foundRequest.data.hasBeenPlayed === hasBeenPlayed){
    return res.status(foundRequest.statusCode).send(foundRequest);
  }
  const updatedRequest = await songService.togglePlayedStatus(id, !foundRequest.data.hasBeenPlayed)
  if(updatedRequest.success){
    if(updatedRequest.data.hasBeenPlayed){
      getIO().emit('SONG_REQUEST_PLAYED', updatedRequest.data);
    } else {
      getIO().emit('SONG_REQUEST_UNPLAYED', updatedRequest.data);
    }
  }
  return res.status(updatedRequest.statusCode).send(updatedRequest);
}

export const deleteSongRequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const foundRequest = await songService.findSongRequestById(id);
  if(!foundRequest.success){
    return res.status(foundRequest.statusCode).send(foundRequest);
  }
  const requestDeleted = await songService.deleteSongRequest(id);
  if(requestDeleted.success){
    getIO().emit('SONG_REQUEST_DELETED', requestDeleted.data)
  }
  return res.status(requestDeleted.statusCode).send(requestDeleted);
}

export const getSongRequestsHandler = async(req: Request, res: Response) => {
  const { q: searchTerm, status } = req.query;
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
  if (!searchTerm) {
    if (status === 'played') {
      sr = await songService.getSongRequestsByStatus(true, page, limit);
    } else if (status === 'unplayed') {
      sr = await songService.getSongRequestsByStatus(false, page, limit);
    } else {
      sr = await songService.getSongRequests(page, limit);
    }
  } else {
    if (status === 'played') {
      sr = await songService.searchSongRequestsByStatus(true, searchTerm as string, page, limit);
    } else if (status === 'unplayed') {
      sr = await songService.searchSongRequestsByStatus(false, searchTerm as string, page, limit);
    } else {
      sr = await songService.searchSongRequests(searchTerm as string, page, limit);
    }
  }
  return res.status(sr.statusCode).send(sr);
}