import type { Track } from "@prisma/client";

import { prisma } from "../client";

/**
 * Find track by its ID.
 *
 * @param id Track ID.
 * @returns The track.
 */
export async function findTrackById(id: number): Promise<Track> {
    return prisma.track.findFirstOrThrow({
        where: {
            id: id
        }
    });
}

/**
 * Get all tracks.
 */
export async function getAllTracks(): Promise<Track[]> {
    return prisma.track.findMany({});
}
