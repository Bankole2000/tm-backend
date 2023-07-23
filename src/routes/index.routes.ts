import { validate } from '../middleware/zodValidate.middleware';
import { defaultHandler } from '../controllers/default.controllers';
import { Router } from 'express';
import { createRequestSchema } from '../utils/validators/songRequest.schema';
import { addSongRequestHandler, deleteSongRequestHandler, getSongRequestsHandler, togglePlayedStatusHandler } from '../controllers/songRequest.controllers';

const apiRouter = Router({ mergeParams: true });

apiRouter.get('/requests', getSongRequestsHandler); // get Song requests
apiRouter.post('/requests', validate(createRequestSchema, 'Song Request'), addSongRequestHandler); // add Song Request
apiRouter.put('/requests/:id', togglePlayedStatusHandler); // toggle Song Request played status
apiRouter.delete('/requests/:id', deleteSongRequestHandler);

export default apiRouter
