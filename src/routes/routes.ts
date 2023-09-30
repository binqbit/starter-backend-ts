import express from 'express';
import * as auth from './auth';

export function initRoutes(app: express.Express) {
    auth.initRoute(app);
}