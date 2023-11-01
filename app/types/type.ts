import { Response } from "express";

//Function types
export type Data = string | number | null | object;

export interface JsonMessages {
  statusCode?: number;
  message: string;
  data?: Data;
  _links?: object[];
  res: Response;
}

export interface RegisterType {
  name: string;
  email: string;
  password: string;
  cpf: string;
  telephone: string;
  birth_day: string | Date;
  crm_state: string;
  crm: string;
  specialty_name: string;
  account_type: string;
}

//Error messages

export interface RegisterErrorMessages {
  invalidTypeErrorMessage: string;
  maxErrorMessage: {
    name: string;
    email: string;
    password: string;
  };
  emailErrorMessage: string;
  minErrorMessage: string;
  regexpErrorMessage: {
    name: string;
    email: string;
  };
  lengthErrorMessage: string;
  emptyErrorMessage: string;
}
