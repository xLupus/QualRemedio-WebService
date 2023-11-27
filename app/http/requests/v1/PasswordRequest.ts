import { z } from "zod";
import { PasswordType, PasswordErrorMessages } from "../../../types/type";
import { i18n } from "i18next";

class PasswordRequest {
    rules({ email, new_password, confirm_password }: PasswordType, translate: i18n) {
        const {
            invalidTypeError,
            maxLengthError,
            emptyFieldError,
            invalidEmailFormatError,
            invalidProviderError,
            requiredFieldError,
            minLengthError
        } = this.messages(translate);

        let validator = z.object({
            email: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .max(50, { message: maxLengthError })
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

            new_password: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .min(1, { message: emptyFieldError })
                .min(8, { message: minLengthError })
                .max(24, { message: maxLengthError }),

            confirm_password: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .min(1, { message: emptyFieldError })
                .min(8, { message: minLengthError })
                .max(24, { message: maxLengthError }),

        }).superRefine((val: unknown, ctx: z.RefinementCtx) => {
            if(new_password !== confirm_password) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: translate.t('error.validation.input.notEquals.password'),
                    path: ['password', 'confirm_password'],
                    fatal: true
                });

                return z.NEVER;
            }
        });
        
        return validator.parse({ email, new_password, confirm_password });
    }

    messages(translate: i18n): PasswordErrorMessages {
        return {
            invalidTypeError: translate.t('error.validation.input.invalidString'),
            maxLengthError: translate.t('error.validation.input.maxLength.email'),
            emptyFieldError: translate.t('error.validation.input.empty'),
            minLengthError: translate.t('error.validation.input.minLength.password'),
            invalidEmailFormatError: translate.t('error.validation.input.invalidEmailFormat'),
            invalidProviderError: translate.t('error.validation.input.invalidProvider'),
            requiredFieldError: translate.t('error.validation.input.required')
        }
    }
}

export default new PasswordRequest();