import Cortex from "./cortex";

async function main(): Promise<void> {
    const user: CortexUser = {
        client_id: "Bzo4T0SaIg16mOmJKu2HDClXr6z3arFp4hNt9J8A",
        client_secret:
            "ILFpRd97oQwdttb8OibWZCLhGorrWnDn3j9ht5LmXKIejueQFrmro10H0h8DYKbJ9JBIa0KUr1DiJSANmbVYgNoR28ckIYsSin1P2ZGyqEAPFfAOoStNrTa6ecqhEegG"
    };

    const c = new Cortex(user);

    await c.epoch();

    await c.requestAccess();
    const headsetId = await c.queryFirstHeadsetID();
    await c.initiateConnectionToHeadset(headsetId);

    const token = await c.authorize();
    const sessionId = await c.createSession(token, headsetId);

    c.subscribe(token, sessionId);
}

main();
