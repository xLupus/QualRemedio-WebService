import { z } from "zod";
import { i18n } from "i18next";
import { BondErrorMessages, BondType } from '../../../types/type';

class BondRequest {
    rules({ user_to_id, bond_id, status_id }: BondType, translate: i18n, reqMethod?: string | undefined) {
        const {
            invalidTypeError,
            integerNumberError,
            emptyFieldError,
            requiredFieldError
        } = this.messages(translate);

        let validator = z.object({
            user_to_id: z
                .number({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .int({ message: integerNumberError })
                .min(1, { message: emptyFieldError })
                .optional()
                .superRefine((val, ctx) => {
                    if(val === undefined && !reqMethod) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.invalid_type,
                            received: 'undefined',
                            expected: 'number',
                            message: requiredFieldError,
                        });
                
                        return z.NEVER;
                    }
                    
                    if(!reqMethod && (bond_id && user_to_id)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `O campo 'bond_id' não pode ser especificado`,
                        });  
                    }

                    if(val) {
                        if(val.toString.length < 1) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.too_small,
                                minimum: 1,
                                inclusive: true,
                                type: 'number',
                                message: emptyFieldError,
                            });
                        }
                    }    
                }),

            bond_id: z
                .number({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .int({ message: integerNumberError })
                .min(1, { message: emptyFieldError })
                .optional()
                .superRefine((val, ctx) => {
                    if(val === undefined && reqMethod) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.invalid_type,
                            received: 'undefined',
                            expected: 'number',
                            message: requiredFieldError,
                        });
                
                        return z.NEVER;   
                    }
                    
                    if(reqMethod && (user_to_id && bond_id)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `O campo 'user_to_id' não pode ser especificado`,
                        });
                    }

                    if(val) {
                        if(val.toString.length < 1) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.too_small,
                                minimum: 1,
                                inclusive: true,
                                type: 'number',
                                message: emptyFieldError,
                            });
                        }
                    }    
                }),

            status_id: z
                .number({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .int({ message: integerNumberError })
                .min(1, { message: emptyFieldError })
                .optional()
                .superRefine((val, ctx) => {
                    if(val === undefined && !reqMethod) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.invalid_type,
                            received: 'undefined',
                            expected: 'number',
                            message: requiredFieldError,
                        });
                
                        return z.NEVER;   
                    }
                    
                    if(val) {
                        if(val.toString.length < 1) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.too_small,
                                minimum: 1,
                                inclusive: true,
                                type: 'number',
                                message: emptyFieldError,
                            });
                        }
                    }    
                })
        });
        
        return validator.parse({ user_to_id, bond_id, status_id });
    }

    messages(translate: i18n): BondErrorMessages {
        return {
            invalidTypeError: translate.t('error.validation.input.invalidDate'),
            integerNumberError: translate.t('error.validation.input.invalidDate'),
            emptyFieldError: translate.t('error.validation.input.empty'),
            requiredFieldError: translate.t('error.validation.input.required')
        }
    }
}

export default new BondRequest();