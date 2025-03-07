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

export interface AuthenticatedRequest extends Request {
    email?: string;
}
