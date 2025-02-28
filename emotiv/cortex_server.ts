import { WebSocket, WebSocketServer } from "ws";

import Cortex from "./cortex";
import dotenv from "dotenv";
import assert from "node:assert";

dotenv.config();

const { CORTEX_CLIENT_ID, CORTEX_CLIENT_SECRET } = process.env;

const wss = new WebSocketServer({ port: 8686 });

wss.on("connection", async (ws: WebSocket) => {
    if (ws.listeners.length > 1) throw new Error("Only one listener can only be used.");

    assert(CORTEX_CLIENT_ID !== undefined);
    assert(CORTEX_CLIENT_SECRET !== undefined);

    const user: CortexUser = {
        client_id: CORTEX_CLIENT_ID,
        client_secret: CORTEX_CLIENT_SECRET
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
