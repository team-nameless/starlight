import express, { Request, Response } from "express";
import HttpStatus from "http-status-codes";

const router = express.Router();

/**
 * Yes, server is alive.
 */
router.get("/", async (_req: Request, res: Response) => {
    res.sendStatus(HttpStatus.OK);
});

export default router;
