import { Request, Response } from 'express';
import { ServiceResponse } from '../@types/ServiseReponse.type';
import { getIO } from '../lib/socketIO';


export const adminLoginHandler = async (req: Request, res: Response) => {
  if(!req.body.email || !req.body.password){
    const sr = new ServiceResponse('Invalid Login Details', null, false, 403, 'Invalid Login Details', 'Invalid Login Details', 'Check email and password');
    return res.status(sr.statusCode).send(sr);
  }
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
    const sr = new ServiceResponse('Login Successful', null, true, 200, null, null, null);
    return res.status(sr.statusCode).send(sr);
  }
  const sr = new ServiceResponse('Invalid Login Details', null, false, 403, 'Invalid Login Details', 'Invalid Login Details', 'Check email and password');
  return res.status(sr.statusCode).send(sr);
};

export const routeNotFoundHandler = async (req: Request, res: Response) => {
  const sr = new ServiceResponse('Route not found', null, false, 404, 'Not found', `Cannot ${req.method} ${req.originalUrl}`, 'Check that endpoint exists and has a handler');
  getIO().emit("ROUTE_NOT_FOUND", sr);
  return res.status(sr.statusCode).send(sr);
};