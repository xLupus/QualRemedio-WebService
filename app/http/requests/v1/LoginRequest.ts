import { z } from "zod";

export interface LoginRequestMessages {
  invalidType: string
  invalidEmailFormat: string
  requiredField: string
}

export interface LoginRequestBody {
  email: string,
  password: string
}

class LoginRequest {
  rules(userData: LoginRequestBody) {
    const {
      invalidEmailFormat,
      invalidType,
      requiredField
    } = this.messages()

    const loginRequestSchema = z.object({
      email: z.string({
        required_error: requiredField,
        invalid_type_error: invalidType
      })
        .email(invalidEmailFormat)
        .min(1, requiredField),

      password: z.string({
        required_error: requiredField,
        invalid_type_error: invalidType
      })
        .min(1, requiredField)
    })

    return loginRequestSchema.safeParse(userData)
  }

  messages() {
    const errorMessages: LoginRequestMessages = {
      invalidType: 'O valor informado deve ser string',
      invalidEmailFormat: 'O formato de e-mail é inválido',
      requiredField: 'Preencha este campo'
    }

    return errorMessages;
  }
}

export default new LoginRequest();