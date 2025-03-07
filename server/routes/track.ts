import express from "express";

const router = express.Router();

/**
 * Get all available songs.
 */
router.get("/", (req, res) => {
    res.sendStatus(200);
});

/**
 * Get a specific song.
 */
router.post("/:songId", (req, res) => {
    res.sendStatus(200);
});

export default router;
