import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import alive from "./routes/alive";
import auth from "./routes/auth";
// import game from "./routes/game";
// import song from "./routes/song";
// import user from "./routes/user";
import { SERVER_PORT } from "./secrets";

const app = express();
const port = SERVER_PORT;

app.use(morgan("combined", { immediate: true }))
    .use(
        rateLimit({
            windowMs: 5 * 60 * 1000,
            limit: 10,
            standardHeaders: "draft-8",
            legacyHeaders: true,
            message: "Slow TF down, choom.",
            skip: function (req, _) {
                return req.get("User-Agent") === "Starlight";
            }
        })
    )
    .use(cookieParser())
    .use(bodyParser.json())
    .use(
        cors({
            credentials: true,
            origin: true
        })
    );

app.use("/api", alive);
app.use("/api", auth);
// app.use("/api/song", song);
// app.use("/api/game", game);
// app.use("/api/user", user);
app.use("/api/static", express.static("__data__"));
app.use("/api/static/avatar", express.static("__data__/__avatar__"));

export const server = app.listen(port, () => {
    console.log(`We are online at http://localhost:${port}`);
});

export default app;
