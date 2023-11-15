import { z } from "zod";

export interface ConsultationRequestMessages {
  invalidStringType: string,
  invalidNumberType: string,
  requiredField: string
}

export interface ConsultationRequestBody {
  date: string,
  reason: string,
  observation: string,
  deparment_id: string,
  consultation_status: string,
  created_by_user: number
}

class ConsultationRequest {
  rules(userData: ConsultationRequestBody) {
    const { invalidStringType, invalidNumberType, requiredField } = this.messages()

    const ConsultationRequestSchema = z.object({
      date: z.date(),

      reason: z.string({
        required_error: requiredField,
        invalid_type_error: invalidStringType
      })
        .min(1, requiredField),

      observation: z.string({
        required_error: requiredField,
        invalid_type_error: invalidStringType
      })
        .min(1, requiredField),

      department_id: z.number({
        required_error: requiredField,
        invalid_type_error: invalidNumberType
      })
        .min(1, requiredField),

      consultation_status: z.number({
        required_error: requiredField,
        invalid_type_error: invalidNumberType
      })
        .min(1, requiredField),

      created_by_user: z.number({
        required_error: requiredField,
        invalid_type_error: invalidNumberType
      })
        .min(1, requiredField),
    })

    return ConsultationRequestSchema.safeParse(userData)
  }

  messages() {
    const errorMessages: ConsultationRequestMessages = {
      invalidStringType: 'O valor informado deve ser do tipo String.',
      invalidNumberType: 'O valor informado deve ser do tipo Number.',
      requiredField: 'Campo Obrigatorio.'
    }

    return errorMessages;
  }
}

export default new ConsultationRequest();