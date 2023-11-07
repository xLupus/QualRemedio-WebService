import { z } from "zod";
import { RegisterErrorMessages, RegisterType } from "../../../types/type";

class RegisterRequest {
    rules({ name, email, password, cpf, telephone, birth_day, crm_state, crm, specialty_name, account_type }: RegisterType) {
        const {
            invalidTypeErrorMessage,
            maxErrorMessage,
            minErrorMessage,
            regexpErrorMessage,
            emailErrorMessage,
            lengthErrorMessage,
            emptyErrorMessage,
        } = this.messages();

        if(account_type === 'carer' || account_type === 'patient') {
            if((crm !== '' || crm_state !== '') || (crm !== '' && crm_state !== '')) throw new Error('O campo informado não pode ser especificado para esse cargo')
        }

        let doctorParamsValidator = z.object({
            crm_state:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .min(1, { message: emptyErrorMessage })
                .length(2, { message: lengthErrorMessage }),
        
            crm:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .min(1, { message: emptyErrorMessage })
                .length(6, { message: lengthErrorMessage }),
        
            specialty_name:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .max(25, { message: maxErrorMessage.name })
                .regex(/[a-zA-Z]/, { message: regexpErrorMessage.name }),
        });

        let carerParamsValidator = z.object({
            specialty_name:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .max(25, { message: maxErrorMessage.name })
                .regex(/[a-zA-Z]/, { message: regexpErrorMessage.name }),
        });
        
        const validator = z.object({
            name:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .min(1, { message: emptyErrorMessage })
                .max(40, { message: maxErrorMessage.name })
                .regex(/[a-zA-Z]/, { message: regexpErrorMessage.name }),

            email:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .max(30, { message: maxErrorMessage.email })
                .min(1, { message: emptyErrorMessage })
                .email({ message: emailErrorMessage })
                .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: regexpErrorMessage.email })
                .toLowerCase(),

            password:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .min(1, { message: emptyErrorMessage })
                .min(8, { message: minErrorMessage })
                .max(24, { message: maxErrorMessage.password }),

            cpf:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .length(11, { message: lengthErrorMessage })
                .min(1, { message: emptyErrorMessage })
                .trim(),

            telephone:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .length(11, { message: lengthErrorMessage })
                .min(1, { message: emptyErrorMessage })
                .trim(),

            birth_day:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .min(1, { message: emptyErrorMessage }),

            crm_state:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .refine((val) => val !== '', {message:  'O campo não deve ser informado'}),
        
            crm:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .refine((val) => val !== '', {message:  'O campo não deve ser informado'}),

            account_type:
                z.string({ invalid_type_error: invalidTypeErrorMessage })
                .min(1, { message: emptyErrorMessage }),

                ...(account_type === 'doctor' ? { doctorParams: doctorParamsValidator } : {}),
                ...(account_type === 'carer' ? { carerParams: carerParamsValidator } : {})
        });

        return validator.parse({ 
            name, 
            email,
            password, 
            cpf, 
            telephone, 
            birth_day, 
            doctorParams: {
                crm,
                crm_state,
                specialty_name
            },
            carerParams: {
                specialty_name
            },
            account_type 
        });
    }

    messages(): RegisterErrorMessages {
        const errorMessages: RegisterErrorMessages = {
            invalidTypeErrorMessage: 'O formato informado deve ser string',
            maxErrorMessage: {
                name: 'O nome deve ter no máximo 40 caracteres',
                email: 'O e-mail deve ter no máximo 30 caracteres',
                password: 'A senha deve ter no máximo 24 caracteres'
            },
            emailErrorMessage: 'O formato de e-mail é inválido',
            minErrorMessage: 'A senha deve ter no minímo 8 caracteres',
            regexpErrorMessage: {
                name: 'O nome não pode conter números, símbolos ou caracteres especiais',
                email: 'O e-mail não corresponde ao padrão específicado'
            },
            lengthErrorMessage: 'O campo informado deve ter 11 caracteres',
            emptyErrorMessage: 'Preencha este campo'
        }

        return errorMessages;
    }
}

export default new RegisterRequest();