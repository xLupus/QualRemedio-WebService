import "dotenv/config";
import express, { Express } from "express";
import passport from "passport";
import { routerApi_V1 } from "../routes/v1/api";
import { swaggerSpec } from "./swagger/v1";
import swaggerUi from 'swagger-ui-express'

const app: Express = express();
export const port: string | number = process.env.SERVER_PORT || 8000;

app.use(passport.initialize());
app.use(express.json());

app.use('/api/v1', routerApi_V1);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => console.log(`Server running on port: ${port}`));