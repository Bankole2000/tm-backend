import { validate } from '../middleware/zodValidate.middleware';
import { Router } from 'express';
import { createRequestSchema } from '../utils/validators/songRequest.schema';
import { addSongRequestHandler, deleteSongRequestHandler, getSongRequestsHandler, togglePlayedStatusHandler, updateSongRequestHandler } from '../controllers/songRequest.controllers';
import { adminLoginHandler } from '../controllers/auth.controllers';

const apiRouter = Router({ mergeParams: true });

apiRouter.post('/login', adminLoginHandler);
apiRouter.get('/requests', getSongRequestsHandler); // get Song requests
apiRouter.post('/requests', validate(createRequestSchema, 'Song Request'), addSongRequestHandler); // add Song Request
apiRouter.put('/requests/:id', togglePlayedStatusHandler); // toggle Song Request played status
apiRouter.patch('/requests/:id', validate(createRequestSchema, 'Update Request'), updateSongRequestHandler);
apiRouter.delete('/requests/:id', deleteSongRequestHandler);

export default apiRouter
