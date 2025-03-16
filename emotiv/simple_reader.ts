import assert from "assert";
import dotenv from "dotenv";

import Cortex from "./cortex";

dotenv.config();

const { CORTEX_CLIENT_ID, CORTEX_CLIENT_SECRET } = process.env;

async function main(): Promise<void> {
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
    console.log(headsetId);
    await c.initiateConnectionToHeadset(headsetId);

    const token = await c.authorize();
    const sessionId = await c.createSession(token, headsetId);

    c.subscribe(token, sessionId);

    setTimeout(() => {
        c.unsubscribe(token, sessionId);
        console.log(`Received unsubscribe token: ${token}`);
    }, 10000);
}

main();
