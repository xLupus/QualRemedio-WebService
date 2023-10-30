import { z } from "zod";
import { RegisterType } from "../../../types/type";

class RegisterRequest {
    rules({ name, email, password, cpf, telephone, birth_day, account_type }: RegisterType) {
        const {
            invalidTypeErrorMessage,
            maxErrorMessage,
            minErrorMessage,
            regexpErrorMessage,
            lenghtErrorMessage,
            emptyErrorMessage,
        } = this.messages();

        const validator = z.object({

        });
        
        return validator.parse({});
    }

    messages() {
        const errorMessages = {
            invalidTypeErrorMessage: '',
            maxErrorMessage: '',
            minErrorMessage: '',
            regexpErrorMessage: '',
            lenghtErrorMessage: '',
            emptyErrorMessage: ''
        }

        return errorMessages;
    }
}

export default new RegisterRequest();