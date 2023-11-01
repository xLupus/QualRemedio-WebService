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
  crm_state?: string | undefined;
  crm?: string | undefined;
  specialty_name?: string | undefined;
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
