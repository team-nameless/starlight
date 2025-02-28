import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import auth from "./routes/auth";
import game from "./routes/game";
import song from "./routes/song";
import user from "./routes/user";
import { SERVER_PORT } from "./secrets";

const app = express();
const port = SERVER_PORT;

app
    .use(bodyParser.json())
    .use(morgan("tiny", { immediate: true }))
    .use(
        rateLimit({
            windowMs: 5 * 60 * 1000,
            limit: 10,
            standardHeaders: "draft-8",
            legacyHeaders: true,
            message: "Slow TF down, choom."
        })
    )
    .use(
        cors({
        credentials: true,
        origin: true
    })
);

app.use("/routes/", auth);
app.use("/routes/song", song);
app.use("/routes/game", game);
app.use("/routes/user", user);

app.listen(port, () => {
    console.log(`We are online at http://localhost:${port}`);
});

export default app;
