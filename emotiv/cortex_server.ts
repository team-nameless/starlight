import { WebSocket, WebSocketServer } from "ws";

import Cortex from "./cortex";

const wss = new WebSocketServer({ port: 8686 });

wss.on("connection", async (ws: WebSocket) => {
    if (ws.listeners.length > 1) throw new Error("Only one listener can only be used.");

    const user: CortexUser = {
        client_id: "vjMBqB8DFsCLgmhBInToyO4ucsHTOU83NSuphSDT",
        client_secret:
            "1zqdwEGengT8sYLO74IFh9kAxPoLFrcTN3WPAzN5WX2thDq9oDuIuKXwnObYMiNTveRW3tsBsuQMkouMC7qMuxMBA1Ci33O2QMjrxSObovRh0EcHDToe1a3xvE9OhQBV"
    };

    const c = new Cortex(user);
    await c.epoch();
    await c.requestAccess();
    const headsetId = await c.queryFirstHeadsetID();
    await c.initiateConnectionToHeadset(headsetId);

    const token = await c.authorize();
    const sessionId = await c.createSession(token, headsetId);

    ws.on("message", async (message: string) => {
        console.log(`Received message: ${message}`);

        const opcode: string = JSON.parse(message)["op"];

        switch (opcode) {
            case "start":
                c.subscribe(token, sessionId);
                break;
            case "stop":
                c.unsubscribe(token, sessionId);
                break;
            default:
                break;
        }
    });
});
