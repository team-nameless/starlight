import request from "supertest";
import app from "../server";
import HttpStatus from "http-status-codes";
import {prisma} from "../prisma/client";

describe("/routes/register", () => {
    const testAgent = request(app);

    const mockUser = {
        handle: "Johny Balatro",
        email: "johny@balatro.not.real",
        password: "123456",
    }

    beforeEach(async () => {
        await prisma.player.deleteMany({});
    });

    it("should return FORBIDDEN if user already exists", async () => {
        await testAgent.post("/api/register").send(mockUser);

        const response = await testAgent.post("/api/register").send(mockUser);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("should return OK if user is new", async () => {
        const response = await testAgent.post("/api/register").send(mockUser);
        expect(response.status).toBe(HttpStatus.OK);
    });
});