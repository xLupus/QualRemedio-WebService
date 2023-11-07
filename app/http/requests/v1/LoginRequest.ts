import { z } from "zod";

export interface LoginRequestMessages {
  invalidStringType: string,
  invalidNumberType: string,
  invalidEmailFormat: string
  requiredField: string
}

export interface LoginRequestBody {
  email: string,
  password: string,
  role: number
}

class LoginRequest {
  rules(userData: LoginRequestBody) {
    const { invalidEmailFormat, invalidStringType, invalidNumberType, requiredField } = this.messages()

    const loginRequestSchema = z.object({
      email: z.string({
        required_error: requiredField,
        invalid_type_error: invalidStringType
      })
        .email(invalidEmailFormat)
        .min(1, requiredField),

      password: z.string({
        required_error: requiredField,
        invalid_type_error: invalidStringType
      })
        .min(1, requiredField),

      role: z.number({
        required_error: requiredField,
        invalid_type_error: invalidNumberType
      })
        .min(1, requiredField)
    })

    return loginRequestSchema.safeParse(userData)
  }

  messages() {
    const errorMessages: LoginRequestMessages = {
      invalidStringType: 'O valor informado deve ser do tipo String.',
      invalidNumberType: 'O valor informado deve ser do tipo Number.',
      invalidEmailFormat: 'O formato de e-mail é inválido.',
      requiredField: 'Campo Obrigatorio.'
    }

    return errorMessages;
  }
}

export default new LoginRequest();