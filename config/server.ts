import "dotenv/config";
import express, { Express } from "express";
import passport from "passport";

import { routerApiV1 } from "../routes/v1/api";
import { i18NextInstanceV1 } from '../app/http/middleware/intl';

const app: Express = express();
export const port: string | number = process.env.SERVER_PORT || 8000;

app.use(passport.initialize());
app.use(express.json());

//api v1
app.use(i18NextInstanceV1); //deixar nessa prioridade !
app.use(routerApiV1);

app.listen(port, () => console.log(`Server running on port: ${port}`));