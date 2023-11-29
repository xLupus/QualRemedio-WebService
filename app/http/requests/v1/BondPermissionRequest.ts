import { z } from "zod";
import { i18n } from "i18next";
import { BondPermissionErrorMessages, BondPermissionType } from '../../../types/type';

class BondPermissionRequest {
    rules({ permission_id, bond_id }: BondPermissionType, translate: i18n) {
        const {
            invalidTypeError,
            requiredFieldError,
            integerNumberError,
        } = this.messages(translate);

        let validator = z.object({
            permission_id: z
                .number({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .int({ message: integerNumberError })
                .positive(),

            bond_id: z
                .number({ 
                    required_error: requiredFieldError,
                    invalid_type_error: invalidTypeError
                })
                .int({ message: integerNumberError })
                .positive()
        });
        
        return validator.parse({ permission_id, bond_id });
    }

    messages(translate: i18n): BondPermissionErrorMessages {
        return {
            invalidTypeError: translate.t('error.validation.input.invalidNumber'),
            integerNumberError: translate.t('error.validation.input.integerNumber'),
            requiredFieldError: translate.t('error.validation.input.required')
        }
    }
}

export default new BondPermissionRequest();