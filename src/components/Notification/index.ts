import * as socketio from "socket.io";

export default class Emitter {
    private socket;

    constructor() {
        this.socket = new socketio();
    }
}