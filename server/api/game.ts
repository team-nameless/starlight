import express from "express";

const router = express.Router();

/**
 * Get the most recent score of this user.
 */
router.get("/recent", (req, res) => {
    res.sendStatus(200);
});

/**
 * Submit the score.
 */
router.post("/:songId/submit", (req, res) => {
    res.sendStatus(200);
});

/**
 * Get the best score of this song ID.
 */
router.get("/:songId/best", (req, res) => {
    res.sendStatus(200);
});

/**
 * Get the most recent score of this song ID.
 */
router.get("/:songId/recent", (req, res) => {
    res.sendStatus(200);
});

export default router;
