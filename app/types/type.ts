import { Response } from "express";

//Function types
export type Data = string | number | null | object;

export interface JsonMessages {
  statusCode? : number,
  message     : string,
  data?       : Data,
  _links?     : object[],
  res         : Response
}