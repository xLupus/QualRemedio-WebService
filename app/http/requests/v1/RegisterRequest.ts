import { z } from "zod";
import { RegisterErrorMessages, RegisterType } from "../../../types/type";
import { i18n } from "i18next";
import moment from 'moment';

class RegisterRequest {
    rules({ name, email, password, cpf, telephone, birth_day, crm_state, crm, specialty_name, account_type }: RegisterType, translate: i18n) {
        const {
            invalidTypeError,
            maxLengthError,
            minLengthError,
            regexpError,
            invalidEmailFormatError,
            invalidProviderError,
            lengthError,
            emptyFieldError,
            requiredFieldError
        } = this.messages(translate);

        birth_day = moment(birth_day, 'DD-MM-YYYY').format('YYYY-MM-DD');

        let validator = z.object({
            name: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError.string
                })
                .min(1, { message: emptyFieldError })
                .max(40, { message: maxLengthError.name })
                .regex(/[a-zA-Z]/, { message: regexpError.name }),

            email: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError.string
                })
                .max(50, { message: maxLengthError.email })
                .min(1, { message: emptyFieldError })
                .email({ message: invalidEmailFormatError })
                .toLowerCase()
                .superRefine((val, ctx) => {
                    const availableEmailProviders: string[] = ['gmail.com', 'outlook.com', 'outlook.com.br'];

                    if(!availableEmailProviders.includes(val.split('@')[1])) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: invalidProviderError
                        });
                    }
                }),

            password: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError.string
                })
                .min(1, { message: emptyFieldError })
                .min(8, { message: minLengthError })
                .max(24, { message: maxLengthError.password }),

            cpf: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError.string
                })
                .length(11, { message: lengthError.cpf })
                .min(1, { message: emptyFieldError })
                .trim(),

            telephone: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError.string
                })
                .length(11, { message: lengthError.telephone })
                .min(1, { message: emptyFieldError })
                .trim(),

            birth_day: z
                .coerce
                .date({
                    invalid_type_error: invalidTypeError.date, 
                    required_error: requiredFieldError
                })
                .min(new Date('1900-01-01'), { message: emptyFieldError }),

            crm_state: z
                .string({ invalid_type_error: invalidTypeError.string })
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
                        
                        if(/[0-9]/.test(val)) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.invalid_string,
                                validation: 'regex',
                                message: regexpError.crm_state,
                            });  
                        }
                    }
                }),

            crm: z
                .string({ invalid_type_error: invalidTypeError.string })
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
                        
                        if(/[a-zA-Z]/.test(val)) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.invalid_string,
                                validation: 'regex',
                                message: regexpError.crm,
                            });  
                        }
                    }    
                }),
                
                          
            specialty_name: z
                .string({ invalid_type_error: invalidTypeError.string })
                .optional()
                .superRefine((val, ctx) => {                  
                    if(val === undefined) {
                        if(account_type === 'patient') return z.NEVER;
                
                        ctx.addIssue({
                            code: z.ZodIssueCode.invalid_type,
                            received: 'undefined',
                            expected: 'string',
                            message: requiredFieldError,
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
                    invalid_type_error: invalidTypeError.string,
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

    messages(translate: i18n): RegisterErrorMessages {
        return {
            invalidTypeError: {
                string: translate.t('error.validation.input.invalidString'),
                date: translate.t('error.validation.input.invalidDate')
            },
            maxLengthError: {
                name: translate.t('error.validation.input.maxLength.name'),
                email: translate.t('error.validation.input.maxLength.email'),
                password: translate.t('error.validation.input.maxLength.password'),
                speacialty_name: translate.t('error.validation.input.maxLength.speacialty_name'),
            },
            invalidEmailFormatError: translate.t('error.validation.input.invalidEmailFormat'),
            invalidProviderError: translate.t('error.validation.input.invalidProvider'),
            minLengthError: translate.t('error.validation.input.minLength.password'),
            regexpError: {
                name: translate.t('error.validation.input.regExp.name'),
                crm: translate.t('error.validation.input.regExp.crm'),
                crm_state: translate.t('error.validation.input.regExp.crm_state')
            },
            lengthError: {
                telephone: translate.t('error.validation.input.length.telephone'),
                cpf: translate.t('error.validation.input.length.cpf'),
                crm_state: translate.t('error.validation.input.length.crm_state'),
                crm: translate.t('error.validation.input.length.crm')
            },
            emptyFieldError: translate.t('error.validation.input.empty'),
            requiredFieldError: translate.t('error.validation.input.required')
        }
    }
}

export default new RegisterRequest();