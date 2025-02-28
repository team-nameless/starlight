import bcrypt from "bcrypt";
import express, { Request } from "express";
import HttpStatus from "http-status-codes";

import { generateAccessJWT } from "../common/jwt";
import { prisma } from "../prisma/client";
import { BasicUserIdentity, RegisterRequest } from "./requests/auth";

const router = express.Router();
const hashRound = 10;

/**
 * Register the user.
 */
router.post("/register", async (req: Request<unknown, unknown, RegisterRequest>, res) => {
    const prismaUser = await prisma.player.findFirst({
        where: {
            Email: req.body.email
        }
    });

    if (prismaUser) {
        res.sendStatus(HttpStatus.FORBIDDEN);
        return;
    }

    await prisma.player.create({
        data: {
            NumericId: Date.now(),
            Email: req.body.email,
            Handle: req.body.handle,
            HashedPassword: await bcrypt.hash(req.body.password, hashRound),
            HashedTemporaryPassword: await bcrypt.hash(req.body.password, hashRound),
            TotalPlayTime: 0,
            ExpOfLevel: 0,
            Level: 1
        }
    });

    res.sendStatus(HttpStatus.OK);
});

/**
 * Send the login request.
 *
 * TODO: Need to make my own request type, with embedded Prisma data.
 */
router.post("/login", async (req: Request<unknown, unknown, BasicUserIdentity>, res) => {
    const prismaUser = await prisma.player.findFirst({
        where: {
            Email: req.body.email
        }
    });

    if (!prismaUser) {
        res.sendStatus(HttpStatus.FORBIDDEN);
        return;
    }

    if (!(await bcrypt.compare(req.body.password, prismaUser.HashedPassword))) {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
        return;
    }

    res.cookie("Token", generateAccessJWT(prismaUser.NumericId), {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.sendStatus(HttpStatus.OK);
});

/**
 * Send the logout request.
 */
router.get("/logout", (req, res) => {
    req.cookies["Token"] = null;

    res.redirect(301, "/");
});

export default router;
