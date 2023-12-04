import { Prisma } from "@prisma/client";
import { z } from "zod";
import validator from "validator"

class UpdateUserRequest {
  rules(user_data: Prisma.UserUpdateInput) {
    const { invalidStringType, invalidDateType, invalidNumberType, numberOfCaracter, requiredField } = this.messages()

    const UpdateUserDataSchema = z.object({
      name: z.string({
        invalid_type_error: invalidStringType,
      })
        .min(1, requiredField)
        .trim()
        .optional(),

      telephone: z.string()
        .min(1, 'Preencha o Campo')
        .refine(
          (phone) => validator.isMobilePhone(phone, "pt-BR"),
          { message: 'Formato de telefone invalido' }
        )
        .optional(),

      profile: z.object({
        bio: z.string({
          invalid_type_error: invalidStringType
        })
          .min(1, requiredField),
      }).optional(),

      birth_day: z.coerce.date({
        errorMap: (issue, { defaultError }) => ({
          message: issue.code === "invalid_date" ? invalidDateType : defaultError,
        })
      })
        .optional(),
    })

    return UpdateUserDataSchema.safeParseAsync(user_data)
  }

  messages() {
    const errorMessages = {
      invalidStringType: 'O valor informado deve ser do tipo String.',
      invalidNumberType: 'O valor informado deve ser do tipo Number.',
      invalidDateType: 'Formato de Data invalido.',
      requiredField: 'Campo Obrigatorio.',
      numberOfCaracter: 'O campo deve ter 11 caracteres'
    }

    return errorMessages;
  }
}

export default new UpdateUserRequest()



