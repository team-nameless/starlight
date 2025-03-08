import HttpStatus from "http-status-codes";
import supertest from "supertest";

import app, { server } from "../server";

const testAgent = supertest(app);

describe("/api/tracks/all", () => {
    afterAll(async () => {
        server.close();
    });

    it("should return everything", async () => {
        const response = await testAgent.get("/api/tracks/all");
        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("/api/tracks/[trackId]", () => {
    afterAll(async () => {
        server.close();
    });

    it("should return OK for existing track", async () => {
        const response = await testAgent.get("/api/tracks/586954");
        expect(response.status).toBe(HttpStatus.OK);
    });

    it("should return NOT_FOUND for random track", async () => {
        const response = await testAgent.get("/api/tracks/123");
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
});
