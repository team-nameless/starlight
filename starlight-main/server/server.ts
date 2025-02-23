import cors from "cors";
import express from "express";

import auth from "./api/auth";
import game from "./api/game";
import song from "./api/song";
import user from "./api/user";

const app = express();
const port = 5000;

app.use(
    cors({
        credentials: true,
        origin: true
    })
);

app.use("/api/", auth);
app.use("/api/song", song);
app.use("/api/game", game);
app.use("/api/user", user);

app.listen(5000, () => {
    console.log(`We are online at http://localhost:${port}`);
});
