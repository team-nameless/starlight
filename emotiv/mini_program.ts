import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8686 });

wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected");

    ws.on("message", (message: string) => {
        console.log(`Received message: ${message}`);

        const opcode = JSON.parse(message)["op"];

        switch (opcode) {
            // TODO: stuffs
            default:
                break;
        }
    });
});
