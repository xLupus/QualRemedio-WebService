import { z } from "zod";
import { i18n } from "i18next";
import { BondErrorMessages, BondType } from '../../../types/type';

class BondRequest {
    rules({ user_to_id, status_id, bond_id, user_to_role_id }: BondType, translate: i18n, reqMethod?: string | undefined) {
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
                .optional()
                .superRefine((val, ctx) => {
                    if(!reqMethod) {
                        if(val === undefined) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.invalid_type,
                                received: 'undefined',
                                expected: 'number',
                                message: requiredFieldError,
                            });
                    
                            return z.NEVER;
                        }
                        
                        if((bond_id || status_id) || (bond_id && bond_id)) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: `Este campo não pode ser especificado`
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
                    }
                }),

            status_id: z
                .number({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .int({ message: integerNumberError })
                .positive()
                .optional()
                .superRefine((val, ctx) => {
                    if(reqMethod === 'PATCH') {
                        if(val === undefined) {
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
                    }
                }),

            user_to_role_id: z
                .number({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .int({ message: integerNumberError })
                .positive()
                .optional()
                .superRefine((val, ctx) => {
                    if(!reqMethod) {
                        if(val === undefined) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.invalid_type,
                                received: 'undefined',
                                expected: 'number',
                                message: requiredFieldError,
                            });
                    
                            return z.NEVER;
                        }
    
                        if((bond_id || status_id) || (bond_id && bond_id)) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: `Este campo não pode ser especificado`
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
                    }
                }),

            bond_id: z
                .number({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .int({ message: integerNumberError })
                .positive()
                .optional()
        });
        
        return validator.parse({ user_to_id, bond_id, status_id, user_to_role_id });
    }

    messages(translate: i18n): BondErrorMessages {
        return {
            invalidTypeError: translate.t('error.validation.input.invalidNumber'),
            integerNumberError: translate.t('error.validation.input.integerNumber'),
            emptyFieldError: translate.t('error.validation.input.empty'),
            requiredFieldError: translate.t('error.validation.input.required')
        }
    }
}

export default new BondRequest();