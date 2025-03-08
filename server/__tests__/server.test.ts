import HttpStatus from "http-status-codes";
import supertest from "supertest";

import app, { server } from "../server";

const testAgent = supertest(app);

describe("hammering the server", () => {
    afterAll(async () => {
        server.close();
    });

    it("should verify that rate-limiting works", async () => {
        // hammer the first 10 requests to trigger the limit.
        await testAgent.get("/api");
        await testAgent.get("/api");
        await testAgent.get("/api");
        await testAgent.get("/api");
        await testAgent.get("/api");
        await testAgent.get("/api");
        await testAgent.get("/api");
        await testAgent.get("/api");
        await testAgent.get("/api");
        await testAgent.get("/api");

        const response = await testAgent.get("/api");
        expect(response.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
    });

    it("should verify that Starlight UA passes the rate-limit", async () => {
        // hammer the first 10 requests to trigger the limit.
        await testAgent.get("/api").set("User-Agent", "Starlight");
        await testAgent.get("/api").set("User-Agent", "Starlight");
        await testAgent.get("/api").set("User-Agent", "Starlight");
        await testAgent.get("/api").set("User-Agent", "Starlight");
        await testAgent.get("/api").set("User-Agent", "Starlight");
        await testAgent.get("/api").set("User-Agent", "Starlight");
        await testAgent.get("/api").set("User-Agent", "Starlight");
        await testAgent.get("/api").set("User-Agent", "Starlight");
        await testAgent.get("/api").set("User-Agent", "Starlight");
        await testAgent.get("/api").set("User-Agent", "Starlight");

        const response = await testAgent.get("/api").set("User-Agent", "Starlight");
        expect(response.status).toBe(HttpStatus.OK);
    });
});
