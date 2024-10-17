// packages
import { Router, json } from "express";
import { hash, verify } from "argon2";
import { randomBytes } from "crypto";
import Ajv from "ajv";
// databases
import postg from "../databases/postgres.mjs";
import redis from "../databases/redis.mjs";

const SESSION_TTL = 60 * 60 * 24;

// schematy do walidacji
const SIGN_UP_SCHEMA = {
    type: "object",
    properties: {
        username: {
            type: "string",
        },
        password: {
            type: "string",
        },
    },
    required: [
        "username",
        "password",
    ],
};
const SIGN_IN_SCHEMA = {
    type: "object",
    properties: {
        username: {
            type: "string",
        },
        password: {
            type: "string",
        },
    },
    required: [
        "username",
        "password",
    ],
};

const ajv = new Ajv();
const validateSignUp = ajv.compile(SIGN_UP_SCHEMA);
const validateSignIn = ajv.compile(SIGN_IN_SCHEMA);

const authRouter = Router();
authRouter.use(json());
authRouter.use((req, res, next) => {
    if (res.locals.session) res.end("already signed in");
    else next();
});

authRouter.post("/sign-up",
    (req, res, next) => {
        const { body } = req;
        if (validateSignUp(body)) {
            next();
        } else {
            res.status(400).end();
        }
    },
    async (req, res) => {
        const { body }: {
            body: {
                username: string,
                password: string,
            }
        } = req;

        const { rowCount } = await postg.query("SELECT FROM accounts WHERE username=$1 LIMIT 1;", [body.username]);
        if (rowCount) {
            res.status(400).end("already exists");
        } else {
            const passwordHash = await hash(body.password);
            await postg.query("INSERT INTO accounts (username, password_hash) VALUES ($1, $2);", [body.username, passwordHash]);
            res.end("success");
        }
    });

authRouter.post("/sign-in",
    (req, res, next) => {
        const { body } = req;
        if (validateSignIn(body)) {
            next();
        } else {
            res.status(400).json(validateSignIn.errors);
        }
    },
    async (req, res) => {
        const { body }: {
            body: {
                username: string,
                password: string,
            }
        } = req;

        const { rowCount, rows: [account] }: {
            rowCount: number | null,
            rows: any,
        } = await postg.query("SELECT * FROM accounts WHERE username=$1 LIMIT 1;", [body.username]);

        if (rowCount && await verify(account.password_hash, body.password)) {

            const sessionId = randomBytes(32).toString("hex");
            await redis.HSET(`session:${sessionId}`, {
                owner_id: account.id,
                username: account.username,
            });
            await redis.EXPIRE(sessionId, SESSION_TTL);

            // res.cookie("session", sessionId, {
            //     "httpOnly": true,
            //     "sameSite": "none",
            //     "maxAge": SESSION_TTL,
            //     "domain": "localhost",
            //     "secure": true,
            // }).end();
            res.json({
                sessionId: sessionId
            });
        } else {
            // login fail
            res.status(400).end("login fail")
        }
    });

export default authRouter;