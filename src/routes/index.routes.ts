import { validate } from '../middleware/zodValidate.middleware';
import { Router } from 'express';
import { createRequestSchema } from '../utils/validators/songRequest.schema';
import { addSongRequestHandler, deleteSongRequestHandler, getSongRequestsHandler, togglePlayedStatusHandler, updateSongRequestHandler } from '../controllers/songRequest.controllers';
import { adminLoginHandler } from '../controllers/auth.controllers';
import { addBatchPerformanceHandler, addPerformanceHandler, deletePerformanceHandler, getPerformancesHandler, searchPerformanceHandler, updatePerformanceHandler } from '../controllers/performance.controllers';

const apiRouter = Router({ mergeParams: true });

apiRouter.post('/login', adminLoginHandler);
apiRouter.get('/requests', getSongRequestsHandler); // get Song requests
apiRouter.post('/requests', validate(createRequestSchema, 'Song Request'), addSongRequestHandler); // add Song Request
apiRouter.put('/requests/:id', togglePlayedStatusHandler); // toggle Song Request played status
apiRouter.patch('/requests/:id', validate(createRequestSchema, 'Update Request'), updateSongRequestHandler);
apiRouter.delete('/requests/:id', deleteSongRequestHandler);
apiRouter.get('/performances/search', searchPerformanceHandler) // filter: ;
apiRouter.get('/performances', getPerformancesHandler) // get all performance record
apiRouter.post('/performances/add', addPerformanceHandler) // create performance record
apiRouter.put('/performances/:id', updatePerformanceHandler) // update performance record
apiRouter.delete('/performances/:id', deletePerformanceHandler) // delete performance record
apiRouter.post('/performances/batch', addBatchPerformanceHandler)
// apiRouter.get('/performances/genres')

export default apiRouter
