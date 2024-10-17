// packages
import { Request, Response, Router, json } from "express";
import Ajv from "ajv";
// databases
import postg from "../databases/postgres.mjs";

const THREAD_SCHEMA = {
    type: "object",
    properties: {
        title: {
            type: "string",
        },
        text: {
            type: "string",
        },
    },
    required: [
        "title",
        "text",
    ],
};

const ajv = new Ajv({ coerceTypes: true });
const validateThreadCreation = ajv.compile(THREAD_SCHEMA);
const validateThreadId = ajv.compile({ type: "number" });

const threadRouter = Router();
threadRouter.use(json());

const authenticationRequired = (req: Request, res: Response, next: () => void) => {
    if (res.locals.session) next();
    else res.status(401).end();
}

threadRouter.post("/",
    authenticationRequired,
    (req, res, next) => {
        const { body } = req;
        if (validateThreadCreation(body)) {
            next();
        } else {
            res.status(400).json(validateThreadCreation.errors);
        }
    },
    async (req, res) => {
        const { body }: {
            body: {
                title: string,
                text: string,
            }
        } = req;
        const { locals: { session } }: {
            locals: any,
            session?: {
                owner_id: number,
                username: string,
            }
        } = res;

        await postg.query("INSERT INTO threads (author_id, title, text) VALUES ($1, $2, $3);", [session.owner_id, body.title, body.text]);
        res.end("success");
    });

threadRouter.get("/",
    async (req, res) => {
        postg.query("SELECT id, title, text FROM threads LIMIT 30;")
            .then(({ rows }) => {
                res.json(rows);
            });
    });

threadRouter.get("/:id",
    (req, res, next) => {
        if (validateThreadId(req.params.id)) {
            next();
        } else {
            res.status(400).end();
        }
    },
    async (req, res) => {
        const { params: { id: threadId } }: {
            params: {
                id: number | string,
            },
        } = req;

        const { rowCount, rows: [thread] }: {
            rowCount: number | null,
            rows: any,
        } = await postg.query("SELECT username AS author, title, text FROM threads JOIN accounts ON author_id=accounts.id WHERE threads.id=$1 LIMIT 1;", [threadId]);
        if (rowCount) {
            res.json(thread);
        } else {
            res.status(404).end();
        }
    });

export default threadRouter;