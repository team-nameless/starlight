import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

import { AuthenticatedRequest } from "../routes/requests/auth";
import { SERVER_KEY } from "../secrets";

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
