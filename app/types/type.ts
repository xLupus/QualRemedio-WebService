import { Response, Request } from "express";

//Function types
type Data = string | number | null | object;

interface JsonMessages {
  statusCode?: number;
  message: string;
  data?: Data;
  _links?: object[];
  res: Response;
}

interface RegisterType {
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

interface BondType {
  user_to_id?: number | undefined;
  bond_id?: number | undefined;
  status_id?: number | undefined;
}

//Error messages

interface RegisterErrorMessages {
  invalidTypeError: {
    string: string;
    date: string;
  };
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

interface BondErrorMessages {
  invalidTypeError: string;
  integerNumberError: string;
  emptyFieldError: string;
  requiredFieldError: string;
}

//Exceptions
interface ExceptionsType {
  err: any;
  req?: Request;
  res: Response;
}

export {
  Data, 

  BondErrorMessages,
  JsonMessages,
  RegisterErrorMessages, 

  BondType,
  RegisterType,
  ExceptionsType
}