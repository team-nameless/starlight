import type { Player } from "@prisma/client";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

import { findUserByEmail } from "../prisma/repository/user";
import { SERVER_KEY } from "../secrets";
import { AuthenticatedRequest } from "../types/auth";

/**
 * Middleware for requiring users to logged in.
 */
export async function mustBeLoggedIn(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token: string = req.signedCookies["Token"];

    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED);
        next(new Error("Token does not exist."));
    }

    try {
        const result = jwt.verify(token, SERVER_KEY!) as JwtPayload;
        const player: Player | null = await findUserByEmail(result.email);
        req.email = result.email;
        req.record = player!;
        next();
    } catch (error) {
        res.status(StatusCodes.FORBIDDEN);
        next(new Error("Token has been tampered."));
    }
}
