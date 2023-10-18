import express from "express"
import "dotenv/config"
import passport from "passport"
import { router_api_v1 } from "../routes/v1/api";

export const port = process.env.SERVER_PORT || 8000;

const app = express();

app.use(express.json())
app.use(passport.initialize())

app.use(router_api_v1);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})


