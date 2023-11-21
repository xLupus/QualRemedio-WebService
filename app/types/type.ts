import { Response, Request } from "express";
import QueryString from 'qs';

//Function types
type Data = string | number | null | object;
type QueryParams = string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;

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
  status_id?: number | undefined;
  bond_id?: number | undefined;
  user_to_role_id?: number | undefined;
}

interface ReminderType {
  label?: string | undefined;
  date_time?: string | Date | undefined;
  reminder_id?: number | undefined;
}

interface QueryParamsType {
  filter?: QueryParams
  sort?: QueryParams
  skip?: QueryParams | number
  take?: QueryParams | number
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

interface ReminderErrorMessages {
  invalidTypeError: {
    string: string;
    number: string;
    date: string;
  };
  integerNumberError: string;
  emptyFieldError: string;
  requiredFieldError: string;
  regExpError: string;
}


interface QueryParamsErrorMessages {
  invalidTypeError: {
    string: string;
    number: string;
  };
  integerNumberError: string;
  emptyFieldError: string;
  requiredFieldError: string;
  nonNegativeError: string;
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
  ReminderErrorMessages,
  JsonMessages,
  RegisterErrorMessages, 
  QueryParamsErrorMessages,
  
  ReminderType,
  BondType,
  RegisterType,
  ExceptionsType,
  QueryParamsType
}