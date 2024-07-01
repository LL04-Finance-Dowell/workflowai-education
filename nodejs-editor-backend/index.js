import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import config from './src/config/index.js';
import { startMessageConsumer } from './src/utils/kafka.js';
import { createTopicByAdmin } from './src/utils/admin.kafka.js';
import routes from './src/routes/index.js';
import { initializeSocket } from './src/config/socket.js';
import { logInfo, logError } from './src/utils/helper.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

createTopicByAdmin();
startMessageConsumer();

const server = http.createServer(app);

app.use('/api/v1/', routes);

app.use('/', (req, res) => {
  logInfo('Server is running fine');
  return res.status(200).json({
    success: true,
    message: 'Server is running fine',
  });
});

initializeSocket(server);

server.on('error', (error) => {
  logError(`Server error: ${error}`);
  process.exit(1);
});

const onListening = () => {
  logInfo(`Listening on port ${config.PORT}`);
  console.log(`Listening on port ${config.PORT}`);
};

try {
  server.listen(config.PORT, onListening);
} catch (error) {
  logError('Failed to start the server', error);
  process.exit(1);
}
