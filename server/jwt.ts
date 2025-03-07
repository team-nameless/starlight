import jwt from "jsonwebtoken";

import { SERVER_KEY } from "./secrets";

/**
 * Create JWT token.
 *
 * @param email User email.
 * @returns The generated token.
 */
export function generateAccessToken(email: string): string {
    return jwt.sign({ email: email }, SERVER_KEY!, {
        expiresIn: "7d"
    });
}
