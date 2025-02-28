import jwt from "jsonwebtoken";
import assert from "node:assert";

import { SERVER_SECRET_KEY } from "../secrets";

/**
 * Create JWT for the user.
 *
 * @param id User ID.
 */
export const generateAccessJWT = function (id: bigint) {
    const payload = { id };

    assert(SERVER_SECRET_KEY !== undefined, "SERVER_SECRET_KEY is required");

    return jwt.sign(payload, SERVER_SECRET_KEY, {
        expiresIn: "1h"
    });
};
