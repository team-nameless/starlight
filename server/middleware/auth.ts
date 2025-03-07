import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

import { SERVER_KEY } from "../secrets";
import { AuthenticatedRequest } from "../types/auth";

/**
 * Middleware for requiring users to logged in.
 */
export function mustBeLoggedIn(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token: string = req.cookies["Token"];

    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED);
        next(new Error("User is unauthenticated."));
    }

    const result = jwt.verify(token, SERVER_KEY!) as JwtPayload;

    req.email = result.email;

    next();
}
