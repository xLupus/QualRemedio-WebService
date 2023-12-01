import { z } from "zod";

export interface PrescriptionRequestMessages {
  invalidStringType: string,
  invalidNumberType: string,
  requiredField: string
}

export interface PrescriptionRequestBody {
  label: string,
  observation: string,
  physical: number
}

class PrescriptionStoreRequest {
  rules(prescription_data: PrescriptionRequestBody) {
    const { invalidStringType, invalidNumberType, requiredField } = this.messages()

    const PrescriptionRequestSchema = z.object({
      label: z.string({
        required_error: requiredField,
        invalid_type_error: invalidStringType
      })
        .min(1, requiredField)
        .max(191, ''),

      observation: z.string({
        required_error: requiredField,
        invalid_type_error: invalidStringType
      })
        .min(1, requiredField)
        .max(2000, ''),

      physical: z.string({
        invalid_type_error: invalidNumberType
      })
        .min(1, requiredField)
        .max(2000, '')
        .optional(),

    })

    return PrescriptionRequestSchema.safeParse(prescription_data)
  }

  messages() {
    const errorMessages: PrescriptionRequestMessages = {
      invalidStringType: 'O valor informado deve ser do tipo String.',
      invalidNumberType: 'O valor informado deve ser do tipo Number.',
      requiredField: 'Campo Obrigatorio.'
    }

    return errorMessages;
  }
}

export default new PrescriptionStoreRequest();