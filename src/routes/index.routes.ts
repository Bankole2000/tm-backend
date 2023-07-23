import { defaultHandler } from '../controllers/default.controllers';
import { Router } from 'express';

const apiRouter = Router();

apiRouter.get('/requests', defaultHandler); // add Song request
apiRouter.post('/requests', defaultHandler); // get Song Requests
apiRouter.put('/requests/:id', defaultHandler); // update Song Request

export default apiRouter
