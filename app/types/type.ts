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
  account_type: string;

  crm_state?: string | undefined;
  crm?: string | undefined;
  specialty_name?: string | undefined;
}

//Error messages

export interface RegisterErrorMessages {
  invalidTypeError: string;
  maxLengthError: {
    name: string;
    email: string;
    password: string;
    speacialty_name: string;
  };
  invalidEmailFormatError: string;
  minLengthError: string;
  regexpError: {
    name: string;
    email: string;
    crm: string;
    crm_state: string;
  };
  lengthError: {
    telephone: string;
    cpf: string;
    crm_state: string;
    crm: string;
  };
  emptyFieldError: string;
  requiredFieldError: string;
}
