import http from 'http';
import { app } from './app';
import { config } from './utils/config';
import { setIO } from './lib/socketIO';

const httpServer = http.createServer(app);

const PORT = config.port;

const io = setIO(httpServer, `/socket`);

io.on('connection', (socket) => {
  console.log('Socket connected');
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

httpServer.listen(PORT, async () => {
  console.log(`TimiKeys API running on port ${PORT}`);
});