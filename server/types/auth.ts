import { Player } from "@prisma/client";
import { Request } from "express";

/**
 * Basic user authentication identity.
 */
export type BasicUserIdentity = {
    email: string;
    password: string;
};

/**
 * Represents a register request.
 */
export type RegisterIdentity = BasicUserIdentity & {
    handle: string;
};

/**
 * An Express request object that ensure user is logged in.
 */
export type AuthenticatedRequest = Request & {
    email?: string;
    record?: Player;
};
