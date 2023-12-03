import { Prisma, PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { JsonMessages } from "../../../functions/function"
import { JsonMessages as IResponseMessage } from "../../../types/type"
import exceptions from '../../../errors/handler'
import path from 'node:path'
import fs from 'node:fs/promises'
import { dbx } from '../../../../config/dropbox'
import { id_parameter_schema, paginate_schema } from '../../schemas'
import PrescriptionStoreRequest from '../../requests/v1/prescription/PrescriptionStoreRequest'
import PrescriptionUpdateRequest from '../../requests/v1/prescription/PrescriptionUpdateRequest'

const prisma = new PrismaClient()

class PrescriptionController {
  async index(req: Request, res: Response) {
    const findmany_args: Prisma.PrescriptionFindManyArgs = {}

    const { filter, sort, skip, take } = req.query

    const json_message: IResponseMessage = {
      statusCode: 200,
      message: 'Lista de Preescripções',
      data: {},
      res
    }

    if (filter) {
      const available_filter_fields = ['created_by', 'bond'] //TODO - Mudar 

      filter.toString().split(',').map(filterParam => {
        const [filterColumn, filterValue] = filterParam.split(':')

        if (available_filter_fields.includes(filterColumn)) {

        }
      })
    }

    if (sort) {
      const available_sort_fields = ['created_by']  //TODO - Mudar 

      const sortParam = sort.toString();
      const param = sortParam.slice(1);

      if (available_sort_fields.includes(param)) {
        const orderOperator = sortParam[0] == '-' ? 'desc' : 'asc';

      }
    }

    try {
      const total_users = await prisma.prescription.findMany({
        where: findmany_args.where
      })

      json_message.data = {
        total_prescriptions: total_users.length
      }

      if (take && skip) {
        const paginate_validation = paginate_schema.safeParse({ take, skip })

        if (paginate_validation.success) {
          const { take, skip } = paginate_validation.data

          findmany_args.take = take
          findmany_args.skip = skip

          json_message.data = {
            ...json_message.data as object,
            number_of_pages: Math.ceil(total_users.length / take)
          }
        }
      }

      try {
        const prescriptions = await prisma.prescription.findMany(findmany_args)

        json_message.data = {
          ...json_message.data as object,
          prescriptions
        }

        return JsonMessages(json_message)
      } catch (err: any) {
        return exceptions({ err, res })
      }
    } catch (err: any) {
      return exceptions({ err, res })
    }
  }

  async show(req: Request, res: Response) {
    const prescription_id_validation = id_parameter_schema.safeParse(req.params.prescription_id)
    const consultation_id_validation = id_parameter_schema.safeParse(req.params.consultation_id)
    const json_message: IResponseMessage = {
      statusCode: 200,
      message: '',
      res
    }

    if (!prescription_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        data: {
          errors: {
            prescription_id: prescription_id_validation.error.formErrors.formErrors
          }
        },
        message: '',
        res
      })


    if (!consultation_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        data: {
          errors: {
            consultation_id: consultation_id_validation.error.formErrors.formErrors
          }
        },
        message: '',
        res
      })

    const prescription_id = prescription_id_validation.data
    const consultation_id = consultation_id_validation.data

    try {
      const prescription = await prisma.prescription.findUnique({
        where: { id: prescription_id, consultation_id }
      })

      if (!prescription)
        return JsonMessages({
          statusCode: 200,
          message: 'Preescrição não encontrada',
          res
        })

      if (prescription.digital) {
        try {
          const res = await dbx.filesGetTemporaryLink({ path: prescription.digital })

          json_message.data = {
            ...json_message.data as object,
            digital_link: res.result.link
          }
        } catch (err: unknown) {
          return exceptions({ res, err })
        }
      }

      json_message.data = {
        ...json_message.data as object,
        prescription
      }

      return JsonMessages(json_message)

    } catch (err: any) {
      return exceptions({ err, res })
    }
  }

  async store(req: Request, res: Response) {
    const prescription_validation = PrescriptionStoreRequest.rules(req.body)
    const consultation_id_validation = id_parameter_schema.safeParse(req.params.consultation_id)
    const digital_prescription = req.file

    const json_message: IResponseMessage = {
      statusCode: 200,
      message: 'Preescripção criada com sucesso',
      res
    }

    if (!consultation_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        data: {
          errors: {
            consultation_id: consultation_id_validation.error.formErrors.formErrors
          }
        },
        message: '',
        res
      })

    if (!prescription_validation.success)
      return JsonMessages({
        res,
        statusCode: 401,
        message: '',
        data: {
          errors: prescription_validation.error.formErrors.fieldErrors
        },
      })

    try {
      const consultation_id = consultation_id_validation.data

      const consultation = await prisma.consultation.findUnique({
        where: { id: consultation_id }
      })

      if (!consultation)
        return JsonMessages({
          res,
          statusCode: 200,
          message: 'Consulta não encontrada'
        })

      const { label, observation, physical } = prescription_validation.data

      const prescription_input: Prisma.PrescriptionCreateInput = { //Todo - Terminar depois
        label,
        observation,
        consultation: { connect: { id: consultation_id } },
        physical: physical ?? undefined,
      }

      if (digital_prescription) {
        const image_path = path.join(
          __dirname,
          '../../../../',
          'storage',
          'temp',
          'prescriptions',
          digital_prescription.filename
        )

        try {
          const file = await fs.readFile(image_path)

          try {
            const dbx_response = await dbx.filesUpload({
              path: `/prescriptions/${digital_prescription.filename}`,
              contents: file
            })

            if (dbx_response.status == 200)
              prescription_input.digital = dbx_response.result.id

          } catch (err: any) {
            return exceptions({ err, res })
          }
        } catch (err: any) {
          return exceptions({ err, res })
        }
      }

      try {
        await prisma.prescription.create({ data: prescription_input })

      } catch (err: any) {
        return exceptions({ err, res })
      }
    } catch (err: any) {
      return exceptions({ err, res })
    }

    return JsonMessages(json_message)
  }

  async update(req: Request, res: Response) {
    const prescription_id_validation = id_parameter_schema.safeParse(req.params.prescription_id)
    const prescription_body_request_validation = PrescriptionUpdateRequest.rules(req.body)
    const prescription_updated_input: Prisma.PrescriptionUpdateInput = {}
    const digital_prescription = req.file

    if (!prescription_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        message: '',
        data: {
          errors: prescription_id_validation.error.formErrors.formErrors
        },
        res
      })

    if (!prescription_body_request_validation.success)
      return JsonMessages({
        statusCode: 401,
        message: '',
        data: {
          errors: prescription_body_request_validation.error.formErrors.fieldErrors
        },
        res,
      })

    const prescription_id = prescription_id_validation.data
    const request_data = prescription_body_request_validation.data

    try {
      const prescription = await prisma.prescription.findUnique({
        where: { id: prescription_id }
      })

      if (!prescription)
        return JsonMessages({
          statusCode: 200,
          message: 'Preescrição não encontrada',
          res
        })

      prescription_updated_input.label = request_data.label ?? undefined
      prescription_updated_input.observation = request_data.observation ?? undefined
      prescription_updated_input.physical = request_data.physical ?? undefined

      if (digital_prescription) {
        const image_path = path.join(
          __dirname,
          '../../../../',
          'storage',
          'temp',
          'prescriptions',
          digital_prescription.filename
        )

        try {
          const file = await fs.readFile(image_path)

          try {
            const dbx_response = await dbx.filesUpload({
              path: `/prescriptions/${digital_prescription.filename}`,
              contents: file
            })

            if (prescription.digital) {
              try {
                const dbx_delete_response = await dbx.filesDeleteV2({
                  path: `/prescriptions/${prescription.digital}`
                })
              } catch (err: any) {
                console.log(err);
              }
            }

            if (dbx_response.status == 200)
              prescription_updated_input.digital = dbx_response.result.id

          } catch (err: any) {
            return exceptions({ err, res })
          }
        } catch (err: any) {
          return exceptions({ err, res })
        }
      }

      try {
        const updated_prescription = await prisma.prescription.update({
          where: { id: prescription_id },
          data: prescription_updated_input
        })

        return JsonMessages({
          statusCode: 200,
          message: 'Prescrição atualizada com sucesso',
          data: {
            success: true
          },
          res
        })
      } catch (err: any) {
        return exceptions({ err, res })
      }
    } catch (err: any) {
      return exceptions({ err, res })
    }
  }

  async delete(req: Request, res: Response) {
    const prescription_id_validation = id_parameter_schema.safeParse(req.params.prescription_id)
    const consultation_id_validation = id_parameter_schema.safeParse(req.params.consultation_id)

    if (!prescription_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        data: {
          errors: prescription_id_validation.error.formErrors.formErrors
        },
        message: '',
        res
      })

    if (!consultation_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        data: {
          errors: {
            consultation_id: consultation_id_validation.error.formErrors.formErrors
          }
        },
        message: '',
        res
      })

    const prescription_id = prescription_id_validation.data
    const consultation_id = consultation_id_validation.data

    try {
      const prescription = await prisma.prescription.findUnique({
        where: { id: prescription_id, consultation_id }
      })

      if (!prescription)
        return JsonMessages({
          statusCode: 200,
          message: 'Preescrição não encontrada',
          data: { success: false },
          res
        })

      try {
        await prisma.prescription.delete({
          where: { id: prescription_id }
        })

        return JsonMessages({
          statusCode: 200,
          message: 'Preescrição apagada com sucesso',
          data: { success: true },
          res
        })
      } catch (err: any) {
        return exceptions({ err, res })
      }
    } catch (err: any) {
      return exceptions({ err, res })
    }
  }
}

export default new PrescriptionController()