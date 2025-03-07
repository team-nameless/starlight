import WebSocket from "ws";

/**
 * The one-thing-fits-all for Cortex API.
 */
class Cortex {
    private socket: WebSocket;
    private user: CortexUser;

    constructor(user: CortexUser, socketUrl: string = "wss://localhost:6868") {
        this.socket = new WebSocket(socketUrl, { rejectUnauthorized: false });
        this.user = user;
    }

    /**
     * Ensure that the WS service is available for concurrent requests.
     *
     * @returns
     */
    async epoch(): Promise<void> {
        const epochRequest = {
            id: 1,
            jsonrpc: "2.0",
            method: "getCortexInfo"
        };

        this.socket.once("open", () => {
            this.socket.send(JSON.stringify(epochRequest));
        });

        return new Promise((resolve, _reject) => {
            this.socket.once("message", () => {
                resolve();
            });
        });
    }

    /**
     * Send the OIDC request access.
     */
    async requestAccess(): Promise<void> {
        const requestAccessRequest = {
            id: 1,
            jsonrpc: "2.0",
            method: "requestAccess",
            params: {
                clientId: this.user.client_id,
                clientSecret: this.user.client_secret
            }
        };

        this.socket.send(JSON.stringify(requestAccessRequest));

        return new Promise((resolve, _reject) => {
            resolve();
        });
    }

    /**
     * Authorize the client.
     */
    async authorize(): Promise<string> {
        const authorizeRequest = {
            id: 1,
            jsonrpc: "2.0",
            method: "authorize",
            params: {
                clientId: this.user.client_id,
                clientSecret: this.user.client_secret,
                debit: 99
            }
        };

        this.socket.send(JSON.stringify(authorizeRequest));

        return new Promise((resolve, _reject) => {
            this.socket.on("message", data => {
                const res: AuthorizationResponse = JSON.parse(data.toString());
                if (res.result?.cortexToken !== undefined) resolve(res.result.cortexToken);
            });
        });
    }

    /**
     * Get FIRST connected headset ID.
     * @returns
     */
    async queryFirstHeadsetID(): Promise<string> {
        const queryHeadsetRequest = {
            id: 1,
            jsonrpc: "2.0",
            method: "queryHeadsets"
        };

        this.socket.send(JSON.stringify(queryHeadsetRequest));

        return new Promise((resolve, _reject) => {
            this.socket.on("message", data => {
                const res: HeadsetDigestionResponse = JSON.parse(data.toString());
                if (res.result?.length !== undefined && res.result.length > 0 && res.result[0]?.id !== undefined)
                    resolve(res.result[0].id);
            });
        });
    }

    /**
     * In case not everything goes like the simulation.
     *
     * @param headsetId
     * @returns
     */
    async initiateConnectionToHeadset(headsetId: string): Promise<void> {
        const controlDeviceRequest = {
            id: 1,
            jsonrpc: "2.0",
            method: "controlDevice",
            params: {
                command: "connect",
                headset: headsetId
            }
        };

        this.socket.send(JSON.stringify(controlDeviceRequest));

        return new Promise((resolve, _reject) => {
            resolve();
        });
    }

    /**
     * Create a session.
     *
     * @param authToken
     * @param headsetId
     * @returns Session ID.
     */
    async createSession(authToken: string, headsetId: string): Promise<string> {
        const createSessionRequest = {
            id: 1,
            jsonrpc: "2.0",
            method: "createSession",
            params: {
                cortexToken: authToken,
                headset: headsetId,
                status: "active"
            }
        };

        this.socket.send(JSON.stringify(createSessionRequest));

        return new Promise((resolve, _reject) => {
            this.socket.on("message", data => {
                const parsedData: SessionCreationResponse = JSON.parse(data.toString());
                if (parsedData.result?.id !== undefined) resolve(parsedData.result.id);
            });
        });
    }

    /**
     * Subscribe to data stream.
     */
    subscribe(token: string, sessionId: string): void {
        const subRequest = {
            id: 1,
            jsonrpc: "2.0",
            method: "subscribe",
            params: {
                cortexToken: token,
                session: sessionId,
                streams: ["met"]
            }
        };

        this.socket.send(JSON.stringify(subRequest));

        this.socket.on("message", data => {
            const parsedData = JSON.parse(data.toString());
            if (parsedData["met"]) console.log(parsedData["met"]);
        });
    }

    unsubscribe(token: string, sessionId: string): void {
        const unsubRequest = {
            id: 1,
            jsonrpc: "2.0",
            method: "unsubscribe",
            params: {
                cortexToken: token,
                session: sessionId,
                streams: ["met"]
            }
        };

        this.socket.send(JSON.stringify(unsubRequest));
    }
}

export default Cortex;
