import HttpStatus from "http-status-codes";
import supertest from "supertest";

import { prisma } from "../prisma/client";
import app, { server } from "../server";

const mockUser = {
    handle: "Johny Balatro",
    email: "johny@balatro.is.not.real",
    password: "123456"
};

const testAgent = supertest(app);

describe("/api/register", () => {
    beforeEach(async () => {
        await prisma.player.deleteMany({});
    });

    afterAll(async () => {
        server.close();
    });

    it("should return FORBIDDEN if user already exists", async () => {
        await testAgent.post("/api/register").set("User-Agent", "Starlight").send(mockUser);

        const response = await testAgent.post("/api/register").set("User-Agent", "Starlight").send(mockUser);

        expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("should return OK if user is new", async () => {
        const response = await testAgent.post("/api/register").set("User-Agent", "Starlight").send(mockUser);
        expect(response.status).toBe(HttpStatus.OK);

        const prismaUser = await prisma.player.findFirst({
            where: {
                Email: mockUser.email
            }
        });

        expect(prismaUser).not.toBeNull();
    });
});

describe("/api/login", () => {
    beforeEach(async () => {
        await prisma.player.deleteMany({});
    });

    afterAll(async () => {
        server.close();
    });

    it("should return FORBIDDEN if user does not exist", async () => {
        const response = await testAgent.post("/api/login").set("User-Agent", "Starlight").send(mockUser);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("should return OK if user valid", async () => {
        await testAgent.post("/api/register").set("User-Agent", "Starlight").send(mockUser);

        const response = await testAgent.post("/api/login").set("User-Agent", "Starlight").send(mockUser);
        expect(response.status).toBe(HttpStatus.OK);
    });

    it("should return UNAUTHORIZED if user invalid", async () => {
        await testAgent.post("/api/register").set("User-Agent", "Starlight").send(mockUser);

        const response = await testAgent
            .post("/api/login")
            .set("User-Agent", "Starlight")
            .send({ ...mockUser, password: "ligma" });

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
});

describe("/api/logout", () => {
    beforeEach(async () => {
        await prisma.player.deleteMany({});
    });

    afterAll(async () => {
        server.close();
    });

    it("should return REDIRECT if user valid", async () => {
        await testAgent.post("/api/register").set("User-Agent", "Starlight").send(mockUser);

        const login = await testAgent.post("/api/login").set("User-Agent", "Starlight").send(mockUser);
        
        const response = await testAgent
            .get("/api/logout")
            .set("User-Agent", "Starlight")
            .set("Cookie", login.get("Set-Cookie")!);

        expect(response.status).toBe(HttpStatus.PERMANENT_REDIRECT);
    });
});
