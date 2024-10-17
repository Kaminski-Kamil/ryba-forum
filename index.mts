// packages
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// databases
import postg from "./databases/postgres.mjs";
import redis from "./databases/redis.mjs";
// routers
import authRouter from "./routers/auth.mjs";
import threadRouter from "./routers/threads.mjs";

const app = express();

app.use(cookieParser());
app.use(cors())

// weryfikacja sesji
app.use(async (req, res, next) => {
    const { cookies: { session: sessionId } } = req;
    if (sessionId) {
        const session = await redis.HGETALL(`session:${sessionId}`);
        if (Object.keys(session).length > 0) {
            res.locals.session = session;
        }
    }
    next();
});

app.use("/auth", authRouter);
app.use("/threads", threadRouter);

// odrzuc jesli sesja nie istnieje
app.use((req, res, next) => {
    if (res.locals.session) next();
    else res.status(401).end();
});

// laczenie z bazami
Promise.all([postg.connect(), redis.connect()])
    .then(() => app.listen(80))
    .catch(err => {
        console.log("database error:", err);
    });