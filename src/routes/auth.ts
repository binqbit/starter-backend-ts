import express, { Request, Response } from 'express';
import { User, userCollection } from '../database/models/User';

declare module "express-session" {
    interface SessionData {
        userId: string
    }
}



export function initRoute(app: express.Express) {
    app.post("/signup", async (req, res) => {
        const login = req.body.login as string;
        const password = req.body.password as string;

        const user = await userCollection().findUserByLogig(login);
        if (user) {
            res.send({
                error: "User already exists!",
            });
            return;
        }

        const newUser = new User(login, password);
        await userCollection().insertUser(newUser);

        res.sendStatus(200);
    });

    app.post("/signin", async (req, res) => {
        const login = req.body.login as string;
        const password = req.body.password as string;

        const user = await userCollection().findUserByLogig(login);
        if (!user) {
            res.send({
                error: "User not found!",
            });
            return;
        }

        if (!user.checkPassword(password)) {
            res.send({
                error: "Password is incorrect!",
            });
            return;
        }

        req.session.userId = user.id;
        res.sendStatus(200);
    });

    app.post("/logout", async (req, res) => {
        req.session.destroy(() => {
            res.sendStatus(200);
        });
    });

    app.get("/auth/check", onlyAuth(async (req, res, user) => {
        res.send({
            login: user.login,
        });
    }));
}



export function onlyAuth(f: ((req: Request, res: Response, user: User) => Promise<void>)) {
    return async (req: Request, res: Response) => {
        const userId = req.session.userId;

        if (!userId) {
            res.sendStatus(401);
            return;
        }

        const user = await userCollection().findUserById(userId);
        if (!user) {
            res
            .send("User not found!")
            .sendStatus(401);
            return;
        }

        await f(req, res, user);
    }
}