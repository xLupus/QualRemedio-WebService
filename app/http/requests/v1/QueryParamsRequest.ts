//Validate sort, filter, pagination or global params fields

import { z } from "zod";
import { i18n } from "i18next";
import { QueryParamsErrorMessages, QueryParamsType } from '../../../types/type';

class QueryParamsRequest {
    rules({ filter, sort, skip, take }: QueryParamsType, translate: i18n) {
        const {
            nonNegativeError,
            invalidTypeError,
            integerNumberError,
            emptyFieldError,
            requiredFieldError
        } = this.messages(translate);

        let validator = z.object({
            filter: z
                .string({
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError.string
                })
                .optional(),

            sort: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError.string
                })
                .optional(),

            skip: z
                .preprocess(
                    (el: unknown, ctx: z.RefinementCtx) => {
                        if(!el) {
                            return;
                        } else if(isNaN(Number(el))) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: invalidTypeError.number,
                                fatal: true
                            });

                            return z.NEVER;
                        }

                        return Number(el);
                    },

                    z
                        .number({ 
                            required_error: requiredFieldError,
                            invalid_type_error: invalidTypeError.number
                        })
                        .int({ message: integerNumberError })
                        .nonnegative({ message: nonNegativeError })
                        .optional()
                        .superRefine((val, ctx) => {
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
                ),

            take: z
                .preprocess(
                    (el: unknown, ctx: z.RefinementCtx) => {
                        if(!el) {
                            return;
                        } else if(isNaN(Number(el))) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: invalidTypeError.number,
                                fatal: true
                            });
                            
                            return z.NEVER;
                        }
                        
                        return Number(el);
                    },
                    
                    z
                        .number({ 
                            required_error: requiredFieldError,
                            invalid_type_error: invalidTypeError.number
                        })
                        .int({ message: integerNumberError })
                        .nonnegative({ message: nonNegativeError })
                        .optional()
                        .superRefine((val, ctx) => {
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
                )
        });
        
        return validator.parse({ filter, sort, skip, take });
    }

    messages(translate: i18n): QueryParamsErrorMessages {
        return {
            invalidTypeError: {
                string: translate.t('error.validation.input.invalidString'),
                number: translate.t('error.validation.input.invalidNumber')
            },
            nonNegativeError: translate.t('error.validation.input.nonNegative'),
            integerNumberError: translate.t('error.validation.input.integerNumber'),
            emptyFieldError: translate.t('error.validation.input.empty'),
            requiredFieldError: translate.t('error.validation.input.required')
        }
    }
}

export default new QueryParamsRequest();