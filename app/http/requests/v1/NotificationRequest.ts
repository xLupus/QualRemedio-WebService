import { z } from "zod";
import { i18n } from "i18next";
import { NotificationErrorMessages, NotificationType } from '../../../types/type';
import moment from "moment";

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
                .string({
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError.string
                })
                .optional()
                .superRefine((val, ctx) => {
                    if(!reqMethod && notification_id) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `Este campo não pode ser especificado`
                        });
                    }

                    if((reqMethod === 'POST' || reqMethod === 'PATCH')) {
                        if(val === undefined) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.invalid_type,
                                received: 'undefined',
                                expected: 'string',
                                message: requiredFieldError,
                                fatal: true
                            });

                            return z.NEVER;
                        }

                        if(val!.length < 1) {
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

                        //TODO: ver o código dos caracteres e colocar aqui
                        if(/[^a-zA-Z0-9,.:/\\\s\u00C0-\u00C5\u00C7-\u00CF\u00D1-\u00D6\u00D9-\u00DB\u00E0-\u00E3\u00E5\u00E7-\u00F5\u00F9-\u00FB]/g.test(val)) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.invalid_string,
                                validation: 'regex',
                                message: regExpError,
                            });  
                        }
                    }
                }),

            message: z
                .string({
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError.string
                })
                .optional()
                .superRefine((val, ctx) => {
                    if(!reqMethod && notification_id) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `Este campo não pode ser especificado`
                        });
                    }

                    if((reqMethod === 'POST' || reqMethod === 'PATCH')) {
                        if(val === undefined) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.invalid_type,
                                received: 'undefined',
                                expected: 'string',
                                message: requiredFieldError,
                                fatal: true
                            });

                            return z.NEVER;
                        }

                        if(val!.length < 1) {
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

                        //TODO: ver o código dos caracteres e colocar aqui
                        if(/[^a-zA-Z0-9,.:/\\\s\u00C0-\u00C5\u00C7-\u00CF\u00D1-\u00D6\u00D9-\u00DB\u00E0-\u00E3\u00E5\u00E7-\u00F5\u00F9-\u00FB]/g.test(val)) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.invalid_string,
                                validation: 'regex',
                                message: regExpError,
                            });  
                        }
                    }
                }),

            read: z
                .boolean({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError.number
                })
                .optional(),

            notification_id: z
                .number({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError.number
                })
                .int({ message: integerNumberError })
                .positive()
                .optional()
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
            requiredFieldError: translate.t('error.validation.input.required')
        }
    }
}

export default new ReminderRequest();