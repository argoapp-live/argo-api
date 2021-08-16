import * as http from "http";
const io = require("socket.io");
import { v4 as uuidv4 } from "uuid";
const { createClient } = require("redis");
const redisAdapter = require("@socket.io/redis-adapter");
import config from "../../config/env";

class NotificationService {
  private serverSocket: SocketIO.Server;

  init(server: http.Server) {
    this.serverSocket = io(server, {
      cors: {
        origin: config.frontendApp.HOST_ADDRESS,
        credentials: true,
        methods: ["GET, POST, PUT, DELETE, OPTIONS"],
        allowedHeaders: [
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With," +
            " Content-Type, Accept," +
            " Authorization," +
            " Access-Control-Allow-Credentials",
        ],
      },
    });

    const pubClient = createClient({
      host: config.redis.HOST,
      port: config.redis.PORT,
      password: config.redis.PASSWORD,
    });
    const subClient = pubClient.duplicate();
    this.serverSocket.adapter(redisAdapter(pubClient, subClient));
    this.serverSocket.on("connection", (socket: SocketIO.Socket) => {
      console.log("NEW SOCKET CONNECTION");
      socket.emit("session", { id: uuidv4() });
    });
  }

  emit(topic: string, data: any) {
    this.serverSocket.emit(topic, data);
  }
}

const notificationService: NotificationService = new NotificationService();
export default notificationService;
