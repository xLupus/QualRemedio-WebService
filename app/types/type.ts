import { Prisma } from "@prisma/client";
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
  account_type: number;

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

interface BondPermissionType {
  label?: string | undefined;
  date_time?: string | Date | undefined;
  reminder_id?: number | undefined;
}

interface ReminderType {
  label?: string | undefined;
  date_time?: string | Date | undefined;
  reminder_id?: number | undefined;
}

interface NotificationType {
  title?: string | undefined;
  message?: string | undefined;
  read?: boolean | undefined;
  notification_id?: number | undefined;
}

interface MailType {
  email: string;
}

interface PasswordType {
  email: string;
  new_password: string;
  confirm_password: string;
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
    number: string;
    date: string;
  };
  maxLengthError: {
    name: string;
    email: string;
    password: string;
    speacialty_name: string;
  };
  invalidEmailFormatError: string;
  invalidProviderError: string;
  integerNumberError: string;
  InvalidFieldError: string;
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

interface NotificationErrorMessages {
  invalidTypeError: {
    string: string;
    number: string;
    date: string;
  };
  integerNumberError: string;
  emptyFieldError: string;
  requiredFieldError: {
    required: string;
    atLeastOne: string;
  };
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

interface MailErrorMessages {
  invalidTypeError: string;
  invalidEmailFormatError: string;
  invalidProviderError: string;
  maxLengthError: string;
  emptyFieldError: string;
  requiredFieldError: string;
}

interface PasswordErrorMessages {
  invalidTypeError: string;
  maxLengthError: string;
  invalidEmailFormatError: string;
  invalidProviderError: string;
  emptyFieldError: string;
  minLengthError: string;
  requiredFieldError: string;
}
//Exceptions
interface ExceptionsType {
  err: any;
  req?: Request;
  res: Response;
}

interface SendUserMail {
  userInfo: any;
  req: Request;
  res: Response;
}

export {
  Data, 

  BondErrorMessages,
  ReminderErrorMessages,
  NotificationErrorMessages,
  JsonMessages,
  SendUserMail,
  RegisterErrorMessages, 
  QueryParamsErrorMessages,
  MailErrorMessages,
  PasswordErrorMessages,
  
  ReminderType,
  BondType,
  BondPermissionType,
  RegisterType,
  NotificationType,
  MailType,
  PasswordType,
  ExceptionsType,
  QueryParamsType
}