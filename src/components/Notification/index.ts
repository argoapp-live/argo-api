import * as http from 'http';
// import * as SocketIO from 'socket.io';
const io = require('socket.io');
import { v4 as uuidv4 } from 'uuid';
// import { createClient, RedisClient } from 'redis';
// import { createAdapter } from '@socket.io/redis-adapter';
const { createClient } = require("redis");
const redisAdapter = require('@socket.io/redis-adapter');

class NotificationService {
    private serverSocket: SocketIO.Server;

    init(server: http.Server) {
        this.serverSocket = io(server);
        
        const pubClient = createClient({ host: '127.0.0.1', port: 6379 });
        const subClient = pubClient.duplicate();
        this.serverSocket.adapter(redisAdapter(pubClient, subClient));
        this.serverSocket.on('connection', (socket: SocketIO.Socket) => {
            console.log('NEW SOCKET CONNECTION');
            socket.emit('session', { id: uuidv4() });
        })
    }

    emit(topic: string, data: any) {
        this.serverSocket.emit(topic, data);
    }
}

const notificationService: NotificationService = new NotificationService();
export default notificationService;