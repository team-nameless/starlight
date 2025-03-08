import express from "express";
import HttpStatus from "http-status-codes";

import { prisma } from "../prisma/client";

const router = express.Router();

/**
 * Get all available tracks.
 */
router.get("/all", async (_req, res) => {
    res.json(await prisma.track.findMany({}));
});

/**
 * Get a specific track.
 */
router.get("/:trackId", async (req, res) => {
    const trackId: number = parseInt(req.params.trackId);

    const foundTrack = await prisma.track.findFirst({
        where: {
            id: trackId
        }
    });

    if (!foundTrack) {
        res.sendStatus(HttpStatus.NOT_FOUND);
        return;
    }

    res.json(foundTrack);
});

export default router;
