import * as SocketIO from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

class NotificationService {
    private serverSocket: SocketIO.Server;

    init() {
        this.serverSocket = SocketIO(3030);
        this.serverSocket.on('connection', (socket: SocketIO.Socket) => {
            socket.emit('session', { id: uuidv4() });
        })
    }

    emit(topic: string, data: any) {
        this.serverSocket.emit(topic, data);
    }
}

const notificationService: NotificationService = new NotificationService();
export default notificationService;