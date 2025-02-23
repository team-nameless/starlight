import WebSocket from "ws";

import { authorizeMessage, connectMessage, sessionMessaage } from "./emotiv_message";

const ws = new WebSocket("wss://localhost:6868", { rejectUnauthorized: false });

const accessToken: string = "";

ws.on("open", () => {
    console.log("Connected to Emotiv data source.");

    ws.send(JSON.stringify(connectMessage));
    ws.send(JSON.stringify(authorizeMessage));
    ws.send(JSON.stringify(sessionMessaage));
});

ws.on("message", (message: string) => {
    console.log(`Received message from server: ${message}`);
});
