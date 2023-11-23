import { z } from "zod";
import { i18n } from "i18next";
import { EmailErrorMessages, EmailType } from '../../../types/type';

class EmailRequest {
    rules({ email }: EmailType, translate: i18n) {
        const {
            invalidTypeError,
            emptyFieldError,
            requiredFieldError,
            maxLengthError,
            invalidEmailFormatError
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
                .toLowerCase(),
        });
        
        return validator.parse({ email });
    }

    messages(translate: i18n): EmailErrorMessages {
        return {
            invalidTypeError: translate.t('error.validation.input.invalidString'),
            maxLengthError: translate.t('error.validation.input.maxLength.email'),
            invalidEmailFormatError: translate.t('error.validation.input.invalidEmailFormat'),
            emptyFieldError: translate.t('error.validation.input.empty'),
            requiredFieldError: translate.t('error.validation.input.required')
        }
    }
}

export default new EmailRequest();