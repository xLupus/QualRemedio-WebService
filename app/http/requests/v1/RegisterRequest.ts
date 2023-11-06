import { z } from "zod";
import { RegisterErrorMessages, RegisterType } from "../../../types/type";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class RegisterRequest {
    rules({ name, email, password, cpf, telephone, birth_day, crm_state, crm, specialty_name, account_type }: RegisterType) {
        const {
            invalidTypeError,
            maxLengthError,
            minLengthError,
            regexpError,
            invalidEmailFormatError,
            lengthError,
            emptyFieldError,
            requiredFieldError
        } = this.messages();

        let validator = z.object({
            name: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .min(1, { message: emptyFieldError })
                .max(40, { message: maxLengthError.name })
                .regex(/[a-zA-Z]/, { message: regexpError.name }),

            email: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .max(30, { message: maxLengthError.email })
                .min(1, { message: emptyFieldError })
                .email({ message: invalidEmailFormatError })
                .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: regexpError.email })
                .toLowerCase(),

            password: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .min(1, { message: emptyFieldError })
                .min(8, { message: minLengthError })
                .max(24, { message: maxLengthError.password }),

            cpf: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .length(11, { message: lengthError.cpf })
                .min(1, { message: emptyFieldError })
                .trim(),

            telephone: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .length(11, { message: lengthError.telephone })
                .min(1, { message: emptyFieldError })
                .trim(),

            birth_day: z
                .string({ 
                    invalid_type_error: invalidTypeError, 
                    required_error: requiredFieldError
                })
                .min(1, { message: emptyFieldError })
                .datetime(),

            crm_state: z
                .string({ invalid_type_error: invalidTypeError })
                .optional()
                .superRefine((val, ctx) => {
                    if(val === undefined) {
                        if(account_type === 'patient' || account_type === 'carer') return z.NEVER;
                        
                        ctx.addIssue({
                            code: z.ZodIssueCode.invalid_type,
                            received: 'undefined',
                            expected: 'string',
                            message: requiredFieldError,
                        });
                
                        return z.NEVER;
                    }

                    if(account_type === 'patient' || account_type === 'carer') {
                        if(val === '') return z.NEVER;

                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `O campo informado não deve ser especificado para o cargo de '${account_type}'`,
                        });
                    } else {
                        if(val.length < 1) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.too_small,
                                minimum: 1,
                                inclusive: true,
                                type: 'string',
                                message: emptyFieldError,
                            });
                        }

                        if(val.length > 2) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.too_big,
                                maximum: 2,
                                inclusive: true,
                                exact: true,
                                type: 'string',
                                message: lengthError.crm_state,
                            });
                        };
                        
                        if(/[a-zA-Z]/.test(val)) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.invalid_string,
                                validation: 'regex',
                                message: regexpError.crm_state,
                            });  
                        }
                    }
                }),

            crm: z
                .string({ invalid_type_error: invalidTypeError })
                .optional()
                .superRefine((val, ctx) => {
                    if(val === undefined) {
                        if(account_type === 'patient' || account_type === 'carer') return z.NEVER;
                        
                        ctx.addIssue({
                            code: z.ZodIssueCode.invalid_type,
                            received: 'undefined',
                            expected: 'string',
                            message: requiredFieldError,
                        });
                
                        return z.NEVER;
                    }

                    if(account_type === 'patient' || account_type === 'carer') {
                        if(val === '') return z.NEVER;

                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `O campo informado não deve ser especificado para o cargo de '${account_type}'`,
                        });
                    } else {
                        if(val.length < 1) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.too_small,
                                minimum: 1,
                                inclusive: true,
                                type: 'string',
                                message: emptyFieldError,
                            });
                        }

                        if(val.length > 6) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.too_big,
                                maximum: 6,
                                inclusive: true,
                                exact: true,
                                type: 'string',
                                message: lengthError.crm,
                            });
                        };
                        
                        if(/[0-9]/.test(val)) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.invalid_string,
                                validation: 'regex',
                                message: regexpError.crm,
                            });  
                        }
                    }    
                }),
                
                          
            specialty_name: z
                .string({ invalid_type_error: invalidTypeError })
                .optional()
                .superRefine((val, ctx) => {                  
                    if(val === undefined) {
                        if(account_type === 'patient') return z.NEVER;
                
                        ctx.addIssue({
                            code: z.ZodIssueCode.invalid_type,
                            received: 'undefined',
                            expected: 'string',
                            message: 'requiredFieldError',
                        });
                
                        return z.NEVER;
                    }

                    if(account_type === 'patient') {
                        if(val === '') return z.NEVER;

                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `O campo informado não deve ser especificado para o cargo de '${account_type} teste'`,
                        });
                    } else {
                        if(val.length < 1) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.too_small,
                                minimum: 1,
                                inclusive: true,
                                type: 'string',
                                message: emptyFieldError,
                            });
                        }

                        if(val.length > 25) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.too_big,
                                maximum: 25,
                                inclusive: true,
                                type: 'string',
                                message: maxLengthError.speacialty_name,
                            });
                        };
                        
                        if(!/[a-zA-Z\s\u00C0-\u00C5\u00C7-\u00CF\u00D1-\u00D6\u00D9-\u00DB\u00E0-\u00E3\u00E5\u00E7-\u00F5\u00F9-\u00FB]/.test(val)) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.invalid_string,
                                validation: 'regex',
                                message: regexpError.name,
                            });  
                        }
                    }    
                }),
            
            account_type:
                z.string({ 
                    invalid_type_error: invalidTypeError,
                    required_error: requiredFieldError
                })
                .min(1, { message: emptyFieldError })
        });

        
        return validator.parse({
            name, 
            email,
            password, 
            cpf, 
            telephone, 
            birth_day,
            account_type,
            crm,
            crm_state,
            specialty_name
        });
    }

    messages(): RegisterErrorMessages {
        return {
            invalidTypeError: 'O formato informado deve ser string',
            maxLengthError: {
                name: 'O nome deve ter no máximo 40 caracteres',
                email: 'O e-mail deve ter no máximo 30 caracteres',
                password: 'A senha deve ter no máximo 24 caracteres',
                speacialty_name: 'A nome da especialidade deve ter no máximo 25 caracteres',
            },
            invalidEmailFormatError: 'O formato de e-mail é inválido',
            minLengthError: 'A senha deve ter no minímo 8 caracteres',
            regexpError: {
                name: 'O nome não pode conter números, símbolos ou caracteres especiais',
                email: 'O e-mail não corresponde ao padrão específicado',
                crm: 'O campo aceita apenas números',
                crm_state: 'O campo aceita apenas letras'
            },
            lengthError: {
                telephone: 'O campo informado deve ter 11 caracteres',
                cpf: 'O campo informado deve ter 11 caracteres',
                crm_state: 'O estado do crm deve ter apenas 2 caracteres',
                crm: 'O crm deve ter 6 caracteres'
            },
            emptyFieldError: 'Preencha este campo',
            requiredFieldError: 'Este campo deve ser especificado'
        }
    }
}

export default new RegisterRequest();