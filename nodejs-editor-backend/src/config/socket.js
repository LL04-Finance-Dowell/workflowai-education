import { Server } from 'socket.io';
import { logError, logInfo } from '../utils/helper.js';
import { exampleEvent } from '../controllers/editor.controller.js';


const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Optionally set the max listeners, if needed
    io.setMaxListeners(15);

    io.on('connection', (socket) => {
        logInfo(`User connected: ${socket.id}`);

        socket.on('example-event', async (data) => { 
            logInfo(`Received 'example-event' event with data: ${JSON.stringify(data)}`);
            
            if (data) {
                try {
                    await exampleEvent(socket, data);
                } catch (error) {
                    logError('Error handling example-event connection:', error);
                    socket.emit('error', { message: 'Error handling event', error: error.message });
                }
            } else {
                logError('Received empty data for example-event');
                socket.emit('error', { message: 'No data provided for the event' });
            }
        });

        socket.on('disconnect', () => {
            logInfo(`User disconnected: ${socket.id}`);
        });
    });
};

export { initializeSocket };
