import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

export interface ConsultationRequestMessages {
  invalidStringType: string,
  invalidNumberType: string,
  invalidDateType: string,
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

class StoreConsultationRequest {
  rules(consultationData: Prisma.ConsultationCreateInput) {
    const { invalidStringType, invalidNumberType, invalidDateType, requiredField } = this.messages()

    const prisma = new PrismaClient()

    const ConsultationRequestSchema = z.object({
      date: z.coerce.date({
        //required_error: requiredField,
        //invalid_type_error: invalidDateType,
        errorMap: (issue, { defaultError }) => ({
          message: issue.code === "invalid_date" ? invalidDateType : defaultError,
        })
      }),

      reason: z.string({
        required_error: requiredField,
        invalid_type_error: invalidStringType
      })
        .min(1, requiredField)
        .max(255, 'Valor maximo de 255 caracteres'),

      observation: z.string({
        required_error: requiredField,
        invalid_type_error: invalidStringType
      })
        .min(1, requiredField)
        .max(2000, 'Valor maximo de 2000 caracteres'),

      department_id: z.number({
        required_error: requiredField,
        invalid_type_error: invalidNumberType
      })
        .min(1, requiredField)
        .refine(async val => {
          const deparment = await prisma.medical_Specialty.findUnique({
            where: { id: val }
          })

          return deparment ? true : false
        },
          'Departamento informado não existe'
        ),

      consultation_status: z.number({
        required_error: requiredField,
        invalid_type_error: invalidNumberType
      })
        .min(1, requiredField)
        .refine(async val => {
          const deparment = await prisma.consultation_Status.findUnique({
            where: { id: val }
          })

          return deparment ? true : false
        },
          'O Status da consulta informado não existe'
        ),

      created_by_user: z.number({
        required_error: requiredField,
        invalid_type_error: invalidNumberType
      })
        .min(1, requiredField)
        .refine(async val => {
          const deparment = await prisma.user.findUnique({
            where: { id: val }
          })

          return deparment ? true : false
        },
          'O usuario informado não existe'
        ),
    })

    return ConsultationRequestSchema.safeParseAsync(consultationData)
  }

  messages() {
    const errorMessages: ConsultationRequestMessages = {
      invalidStringType: 'O valor informado deve ser do tipo String.',
      invalidNumberType: 'O valor informado deve ser do tipo Number.',
      invalidDateType: 'Formato de Data invalido.',
      requiredField: 'Campo Obrigatorio.'
    }

    return errorMessages;
  }
}

export default new StoreConsultationRequest();