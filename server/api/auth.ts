import express from "express";

const router = express.Router();

/**
 * Register the user.
 */
router.post("/register", (req, res) => {
    res.sendStatus(200);
});

/**
 * Send the login request.
 */
router.post("/login", (req, res) => {
    res.sendStatus(200);
});

/**
 * Send the logout request.
 */
router.get("/logout", (req, res) => {
    res.sendStatus(200);
});

export default router;
