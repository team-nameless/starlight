import type { Player } from "@prisma/client";
import bcrypt from "bcrypt";

import { RegisterIdentity } from "../../types/auth";
import { prisma } from "../client";

/**
 * Create a user entry.
 *
 * @param request Identity request.
 * @returns The created user entry.
 */
export async function createUserByEmail(request: RegisterIdentity): Promise<Player> {
    const HASH_ROUND = 5;
    const HASH_PASSWORD = await bcrypt.hash(request.password, HASH_ROUND);

    return prisma.player.create({
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
    return prisma.player.findFirst({
        where: {
            Email: email
        }
    });
}

/**
 * Delete a player. THIS IS NOT A DRILL.
 *
 * @param email The email address.
 */
export async function deleteUserByEmail(email: string): Promise<void> {
    await prisma.player.delete({
        where: {
            Email: email
        }
    });
}
