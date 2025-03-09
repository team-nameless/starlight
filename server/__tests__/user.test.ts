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

describe("/api/user", () => {
    beforeEach(async () => {
        await prisma.player.deleteMany({});
    });

    afterAll(async () => {
        server.close();
    });

    it("should successfully delete the user", async () => {
        await testAgent.post("/api/register").set("User-Agent", "Starlight").send(mockUser);
        const login = await testAgent.post("/api/login").set("User-Agent", "Starlight").send(mockUser);

        const response = await testAgent
            .delete("/api/user")
            .set("User-Agent", "Starlight")
            .set("Cookie", login.get("Set-Cookie")!)
            .send(mockUser);

        expect(response.status).toBe(HttpStatus.OK);

        const foundUser = await prisma.player.findUnique({
            where: {
                Email: mockUser.email
            }
        });

        expect(foundUser).toBe(null);
    });
});
