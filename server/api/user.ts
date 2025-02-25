import express from "express";

const router = express.Router();

/**
 * Get the user.
 */
router.get("/", (req, res) => {
    res.sendStatus(200);
});

/**
 * Update the user information.
 */
router.patch("/", (req, res) => {
    res.sendStatus(200);
});

/**
 * Update the user avatar.
 */
router.put("/image", (req, res) => {
    res.sendStatus(200);
});

/**
 * Reset the user avatar.
 */
router.delete("/image", (req, res) => {
    res.sendStatus(200);
});

/**
 * Get the user settings.
 */
router.get("/settings", (req, res) => {
    res.sendStatus(200);
});

/**
 * Update the user settings.
 */
router.patch("/settings", (req, res) => {
    res.sendStatus(200);
});

/**
 * Delete the user.
 */
router.delete("/", (req, res) => {
    res.sendStatus(200);
});

export default router;
