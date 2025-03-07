import type { Player } from "@prisma/client";
import bcrypt from "bcrypt";

import { RegisterIdentity } from "../../routes/requests/auth";
import { prisma } from "../client";

/**
 * Create an user entry.
 *
 * @param handle The display name.
 * @param email The email.
 * @param password The password, the raw one.
 * @returns The created user entry.
 */
export async function createUserByEmail(request: RegisterIdentity): Promise<Player> {
    const HASH_ROUND = 5;
    const HASH_PASSWORD = await bcrypt.hash(request.password, HASH_ROUND);

    return await prisma.player.create({
        data: {
            NumericId: Date.now(),
            Handle: request.handle,
            Email: request.email,
            HashedPassword: HASH_PASSWORD,
            HashedTemporaryPassword: HASH_PASSWORD,
            TotalPlayTime: 0,
            ExpOfLevel: 0,
            Level: 1
        }
    });
}

/**
 * Find a player by their email address.
 *
 * @param email The email address.
 * @returns The user model.
 */
export async function findUserByEmail(email: string): Promise<Player | null> {
    return await prisma.player.findFirst({
        where: {
            Email: email
        }
    });
}
