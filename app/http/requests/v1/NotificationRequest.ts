import { z } from "zod";
import { i18n } from "i18next";
import { NotificationErrorMessages, NotificationType } from '../../../types/type';

class ReminderRequest {
    rules({ title, message, read, notification_id }: NotificationType, translate: i18n, reqMethod?: string | undefined) {
        const {
            invalidTypeError,
            emptyFieldError,
            requiredFieldError,
            integerNumberError,
            regExpError
        } = this.messages(translate);

        let validator = z.object({
            title: z
                .preprocess(
                    (el: unknown, ctx: z.RefinementCtx) => {
                        if(reqMethod === 'PATCH') {
                            if(el === '') {
                                el = undefined;

                                return;
                            }
                        } else if(reqMethod === 'POST') {
                            if(el === undefined) {
                                ctx.addIssue({
                                    code: z.ZodIssueCode.invalid_type,
                                    received: 'undefined',
                                    expected: 'string',
                                    message: requiredFieldError.required
                                });
                            }
                        }

                        return el;
                    },

                    z
                        .string({
                            required_error: requiredFieldError.required,
                            invalid_type_error: invalidTypeError.string
                        })
                        .optional()
                        .superRefine((val: string | undefined, ctx: z.RefinementCtx) => {
                            if(reqMethod === 'POST') {
                                if(val) {
                                    if(val.length < 1) {
                                        ctx.addIssue({
                                            code: z.ZodIssueCode.too_small,
                                            minimum: 1,
                                            inclusive: true,
                                            type: 'string',
                                            message: emptyFieldError,
                                            fatal: true
                                        });
            
                                        return z.NEVER;
                                    }
                                }
                            }
                    
                            if(reqMethod === 'POST' || reqMethod === 'PATCH') {
                                if(val) {
                                    //TODO: ver o código dos caracteres e colocar aqui
                                    if(/[^a-zA-Z0-9,.:?/\\\s\u00C0-\u00C5\u00C7-\u00CF\u00D1-\u00D6\u00D9-\u00DB\u00E0-\u00E3\u00E5\u00E7-\u00F5\u00F9-\u00FB]/g.test(val)) {
                                        ctx.addIssue({
                                            code: z.ZodIssueCode.invalid_string,
                                            validation: 'regex',
                                            message: regExpError,
                                        });  
                                    }
                                }
                            }    
                        })
                ),

            message: z
               .preprocess(
                    (el: unknown, ctx: z.RefinementCtx) => {
                        if(reqMethod === 'PATCH') {
                            if(el === '') {
                                el = undefined;

                                return;
                            }
                        } else if(reqMethod === 'POST') {
                            if(el === undefined) {
                                ctx.addIssue({
                                    code: z.ZodIssueCode.invalid_type,
                                    received: 'undefined',
                                    expected: 'string',
                                    message: requiredFieldError.required
                                });
                            }
                        }

                        return el;
                    },

                    z
                        .string({
                            required_error: requiredFieldError.required,
                            invalid_type_error: invalidTypeError.string
                        })
                        .optional()
                        .superRefine((val: string | undefined, ctx: z.RefinementCtx) => {
                            if(reqMethod === 'POST') {
                                if(val) {
                                    if(val.length < 1) {
                                        ctx.addIssue({
                                            code: z.ZodIssueCode.too_small,
                                            minimum: 1,
                                            inclusive: true,
                                            type: 'string',
                                            message: emptyFieldError,
                                            fatal: true
                                        });
            
                                        return z.NEVER;
                                    }
                                }
                            }
        
                            if(reqMethod === 'POST' || reqMethod === 'PATCH') {
                                if(val) {
                                    //TODO: ver o código dos caracteres e colocar aqui
                                    if(/[^a-zA-Z0-9,.:?/\\\-\s\u00C0-\u00C5\u00C7-\u00CF\u00D1-\u00D6\u00D9-\u00DB\u00E0-\u00E3\u00E5\u00E7-\u00F5\u00F9-\u00FB]/g.test(val)) {
                                        ctx.addIssue({
                                            code: z.ZodIssueCode.invalid_string,
                                            validation: 'regex',
                                            message: regExpError,
                                        });  
                                    }
                                }
                            }
                        })
                ),

            read: z
                .boolean({ 
                    required_error: requiredFieldError.required,
                    invalid_type_error: invalidTypeError.number
                })
                .optional(),

            notification_id: z
                .preprocess(
                    (el: unknown, ctx: z.RefinementCtx) => {
                        if(reqMethod === 'POST') return;

                        return el;
                    },
                    
                    z
                        .number({ 
                            required_error: requiredFieldError.required,
                            invalid_type_error: invalidTypeError.number
                        })
                        .int({ message: integerNumberError })
                        .positive()
                        .optional()
                        .superRefine((val: number | undefined, ctx: z.RefinementCtx) => {
                            if(reqMethod === 'POST' && val) return z.NEVER;
                        })
                )
        }).superRefine((val, ctx) => {
            if(reqMethod === 'PATCH') {
                if(!title && !message && !read) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.invalid_type,
                        received: 'undefined',
                        expected: 'string',
                        path: ['title', 'message', 'read'],
                        message: requiredFieldError.atLeastOne
                    });
                }
            }
        });
        
        return validator.parse({ title, message, read, notification_id });
    }

    messages(translate: i18n): NotificationErrorMessages {
        return {
            invalidTypeError: {
                string: translate.t('error.validation.input.invalidString'),
                number: translate.t('error.validation.input.invalidNumber'),
                date: translate.t('error.validation.input.invalidDate')
            },
            integerNumberError: translate.t('error.validation.input.integerNumber'),
            emptyFieldError: translate.t('error.validation.input.empty'),
            regExpError: translate.t('error.validation.input.regExp.label'),
            requiredFieldError: {
                required: translate.t('error.validation.input.required'),
                atLeastOne: translate.t('error.validation.input.atLeastOne')
            }
        }
    }
}

export default new ReminderRequest();