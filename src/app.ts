import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {
  getExcelFileSongs,
  routeNotFoundHandler,
} from './controllers/default.controllers';
import apiRouter from './routes/index.routes';
import { requireApiKeyForWrites } from './middleware/apiKey.middleware';

const app: Express = express();

// Railway sits behind one proxy; needed so rate limiting sees the real client IP
app.set('trust proxy', 1);
app.use(requireApiKeyForWrites);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// app.use(getUserIfLoggedIn);

app.use('/api/v1', apiRouter);

app.get('/json-songs', getExcelFileSongs);

app.use('*', routeNotFoundHandler);

export { app };