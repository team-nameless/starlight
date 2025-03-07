import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import HttpStatus from "http-status-codes";

import { generateAccessToken } from "../jwt";
import { mustBeLoggedIn } from "../middleware/auth";
import { createUserByEmail, findUserByEmail } from "../prisma/repository/user";
import { AuthenticatedRequest, BasicUserIdentity, RegisterIdentity } from "./requests/auth";

const router = express.Router();

/**
 * Register the user.
 */
router.post("/register", async (req: Request<unknown, unknown, RegisterIdentity>, res) => {
    const prismaUser = await findUserByEmail(req.body.email);

    if (prismaUser) {
        res.sendStatus(HttpStatus.FORBIDDEN);
        return;
    }

    await createUserByEmail(req.body);

    res.sendStatus(HttpStatus.OK);
});

/**
 * Send the login request.
 */
router.post("/login", async (req: Request<unknown, unknown, BasicUserIdentity>, res) => {
    const prismaUser = await findUserByEmail(req.body.email);

    if (!prismaUser) {
        res.sendStatus(HttpStatus.FORBIDDEN);
        return;
    }

    if (!(await bcrypt.compare(req.body.password, prismaUser.HashedPassword))) {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
        return;
    }

    const token = generateAccessToken(req.body.email);

    res.cookie("Token", token);

    res.sendStatus(HttpStatus.OK);
});

/**
 * Send the logout request.
 */
router.get("/logout", mustBeLoggedIn, (req: AuthenticatedRequest, res: Response) => {
    res.sendStatus(HttpStatus.PERMANENT_REDIRECT);
});

export default router;
