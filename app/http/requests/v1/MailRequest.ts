import { z } from "zod";
import { MailType, MailErrorMessages } from "../../../types/type";
import { i18n } from "i18next";

class MailRequest {
    rules({ email, urlContext }: MailType, translate: i18n) {
        const {
            invalidTypeError,
            maxLengthError,
            invalidEmailFormatError,
            invalidProviderError,
            emptyFieldError,
            requiredFieldError
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
                    const availableEmailProviders: string[] = ['gmail.com', 'outlook.com', 'outlook.com.br', 'hotmail.com', 'hotmail.com.br'];

                    if(!availableEmailProviders.includes(val.split('@')[1])) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: invalidProviderError
                        });
                    }
                }),

            urlContext: z
                .string({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .min(1, { message: emptyFieldError })
        });
        
        return validator.parse({ email, urlContext });
    }

    messages(translate: i18n): MailErrorMessages {
        return {
            invalidTypeError: translate.t('error.validation.input.invalidString'),
            maxLengthError: translate.t('error.validation.input.maxLength.email'),
            invalidEmailFormatError: translate.t('error.validation.input.invalidEmailFormat'),
            invalidProviderError: translate.t('error.validation.input.invalidProvider'),
            emptyFieldError: translate.t('error.validation.input.empty'),
            requiredFieldError: translate.t('error.validation.input.required')
        }
    }
}

export default new MailRequest();