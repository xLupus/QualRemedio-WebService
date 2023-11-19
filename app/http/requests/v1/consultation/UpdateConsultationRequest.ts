import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

export interface ConsultationRequestMessages {
  invalidStringType: string,
  invalidNumberType: string,
  invalidDateType: string,
  requiredField: string
}

class StoreConsultationRequest {
  rules(consultationData: Prisma.ConsultationUpdateInput) {
    const { invalidStringType, invalidNumberType, invalidDateType, requiredField } = this.messages()

    const prisma = new PrismaClient()

    const ConsultationRequestSchema = z.object({
      date: z.coerce.date({
        errorMap: (issue, { defaultError }) => ({
          message: issue.code === "invalid_date" ? invalidDateType : defaultError,
        })
      })
        .optional(),


      reason: z.string({
        invalid_type_error: invalidStringType
      })
        .max(255, 'Valor maximo de 255 caracteres')
        .optional(),


      observation: z.string({
        invalid_type_error: invalidStringType
      })
        .max(2000, 'Valor maximo de 2000 caracteres')
        .optional(),


      department_id: z.number({ ///specialty
        invalid_type_error: invalidNumberType
      })
        .refine(async val => {
          const deparment = await prisma.medical_Specialty.findUnique({
            where: { id: val }
          })

          return deparment ? true : false
        },
          'Departamento informado não existe'
        )
        .optional(),


      consultation_status: z.number({
        invalid_type_error: invalidNumberType
      })
        .refine(async val => {
          const deparment = await prisma.consultation_Status.findUnique({
            where: { id: val }
          })

          return deparment ? true : false
        },
          'O Status da consulta informado não existe'
        )
        .optional(),

        
      created_by_user: z.number({
        invalid_type_error: invalidNumberType
      })
        .refine(async val => {
          const deparment = await prisma.user.findUnique({
            where: { id: val }
          })

          return deparment ? true : false
        },
          'O usuario informado não existe'
        )
        .optional(),
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