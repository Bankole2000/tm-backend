import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {
  getExcelFileSongs,
  routeNotFoundHandler,
} from './controllers/default.controllers';
import apiRouter from './routes/index.routes';

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
// app.use(getUserIfLoggedIn);

app.use('/api/v1', apiRouter);

app.get('/json-songs', getExcelFileSongs);

app.use('*', routeNotFoundHandler);

export { app };