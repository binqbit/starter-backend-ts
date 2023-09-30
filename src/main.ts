require("dotenv").config();

import express from "express";
import sessions from 'express-session';
import uuid from 'node-uuid';
import fileUpload from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";

import { initRoutes } from "./routes/routes";
import database from "./database/database";

const app = express();
const secret = process.env.SECRET_KEY as string;

app.use(sessions({
    secret: secret,
    saveUninitialized: true,
    resave: false,
    genid: function(){
        let id = uuid.v1();
        console.log("new session: " + id);
        return id;
    },
    cookie: {
        maxAge: 60 * 60 * 1000,
        sameSite: true,
    }
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));



app.get("/", async (req, res) => {
    res.send("Hello World!");
});

initRoutes(app);



app.listen(8000, "0.0.0.0", async () => {
    console.log("start localhost:8000 listening...");
    await database.connect();
});