import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client"
import exceptions from '../../../errors/handler'
import { JsonMessages } from "../../../functions/function";
import { JsonMessages as IResponseMessage } from "../../../types/type";
import StoreConsultationRequest from "../../requests/v1/consultation/StoreConsultationRequest";
import { id_parameter_schema, paginate_schema } from "../../schemas";
import UpdateConsultationRequest from "../../requests/v1/consultation/UpdateConsultationRequest";

const prisma = new PrismaClient()

class ConsultationController {
  /**
   * 
   */
  async index(req: Request, res: Response) {
    const findmany_args: Prisma.ConsultationFindManyArgs = {}
    const { filter, sort, skip, take } = req.query

    const json_message: IResponseMessage = {
      statusCode: 200,
      message: 'Lista de Consultas',
      data: {},
      res
    }

    if (filter) {
      const available_filter_fields = ['created_by', 'bond'] //TODO - Mudar 

      filter.toString().split(',').map(filterParam => {
        const [filterColumn, filterValue] = filterParam.split(':')

        if (available_filter_fields.includes(filterColumn)) {
          if (filterColumn == 'created_by') {
            const created_by_validation = id_parameter_schema.safeParse(Number(filterValue))

            if (created_by_validation.success)
              findmany_args.where = {
                ...findmany_args.where,
                created_by_user: created_by_validation.data
              }
          }

          if (filterColumn == 'bond') {
            const bond_validation = id_parameter_schema.safeParse(Number(filterValue))

            if (bond_validation.success)
              findmany_args.where = {
                ...findmany_args.where,
                bond_id: bond_validation.data
              }
          }
        }
      })
    }

    if (sort) {
      const available_sort_fields = ['created_at',]  //TODO - Mudar 

      const sortParam = sort.toString();
      const param = sortParam.slice(1);

      if (available_sort_fields.includes(param)) {
        const orderOperator = sortParam[0] == '-' ? 'desc' : 'asc';

      }
    }

    try {
      const total_users = await prisma.consultation.findMany({
        where: findmany_args.where
      })

      json_message.data = {
        total_consultations: total_users.length
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
      //!
      findmany_args.include = {
        status: true,
        specialty: true,
        bond: {
          select: {
            to: {
              select: {
                name: true,
                id: true
              }
            },
          }
        }
      }

      try {
        const consultations = await prisma.consultation.findMany(findmany_args)

        json_message.data = {
          ...json_message.data as object,
          consultations
        }

        return JsonMessages(json_message)
      } catch (err: any) {
        return exceptions({ err, res })
      }
    } catch (err: any) {
      return exceptions({ err, res })
    }
  }

  /**
   * 
   */
  async show(req: Request, res: Response) {
    const consultation_id_validation = id_parameter_schema.safeParse(Number(req.params.consultation_id))

    if (!consultation_id_validation.success)
      return JsonMessages({
        statusCode: 400,
        data: {
          errors: consultation_id_validation.error.formErrors.formErrors
        },
        message: '',
        res
      })

    try {
      const consultation = await prisma.consultation.findUnique({
        where: { id: consultation_id_validation.data },
        include: {
          created_by: true,
          specialty: true,
          status: true,
          bond: {
            select: {
              to: {
                select: {
                  name: true,
                  id: true
                }
              }
            }
          },
          prescription: true
        }
      })

      if (!consultation)
        return JsonMessages({
          statusCode: 200,
          message: 'Consulta não encontrada',
          res
        })

      return JsonMessages({
        statusCode: 200,
        message: '',
        data: consultation,
        res
      })

    } catch (err: any) {
      return exceptions({ err, res })
    }
  }
  /** 
   * 
   */
  async store(req: Request, res: Response) {
    const bond_id_validation = id_parameter_schema.safeParse(Number(req.params.bond_id))
    const consultation_validation = await StoreConsultationRequest.rules(req.body)



    if (!bond_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        data: {
          errors: bond_id_validation.error.formErrors.formErrors
        },
        message: '',
        res
      })

    if (!consultation_validation.success)
      return JsonMessages({
        statusCode: 200,
        data: {
          errors: consultation_validation.error.formErrors.fieldErrors
        },
        message: '',
        res
      })

    try {
      const bond = await prisma.bond.findUnique({
        where: { id: bond_id_validation.data }
      })

      if (!bond)
        return JsonMessages({
          statusCode: 200,
          message: 'Vinculo não encontrado',
          res
        })

      try {
        const { reason, consultation_status, created_by_user, date, department_id, observation } = consultation_validation.data


        if(bond_id_validation.data) {
          await prisma.consultation.create({
            data: {
              bond_id: bond_id_validation.data,
              department_id,
              reason,
              observation,
              consultation_status,
              created_by_user,
              date_of_consultation: date,
            }
          })

          return JsonMessages({
            statusCode: 200,
            message: 'Consulta Criada com sucesso',
            res
          })
  
        }

        
      } catch (err: any) {
        return exceptions({ err, res })
      }
    } catch (err: any) {
      return exceptions({ err, res })
    }

  }

  /**
   * 
   */
  async update(req: Request, res: Response) {
    const consultation_update_input: Prisma.ConsultationUpdateInput = {}
    const consultation_id_validation = id_parameter_schema.safeParse(Number(req.params.consultation_id))
    const consultation_update_validation = await UpdateConsultationRequest.rules(req.body)

    if (!consultation_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        data: {
          errors: consultation_id_validation.error.formErrors.formErrors
        },
        message: '',
        res
      })

    if (!consultation_update_validation.success)
      return JsonMessages({
        statusCode: 200,
        data: {
          errors: consultation_update_validation.error.formErrors.fieldErrors
        },
        message: '',
        res
      })

    try {
      const consultation_id = consultation_id_validation.data

      const consultation = await prisma.consultation.findUnique({
        where: { id: consultation_id }
      })

      if (!consultation)
        return JsonMessages({
          statusCode: 200,
          message: 'Consulta não encontrada',
          res
        })

      const { data } = consultation_update_validation

      consultation_update_input.reason = data.reason ?? undefined
      consultation_update_input.observation = data.observation ?? undefined
      consultation_update_input.date_of_consultation = data.date ?? undefined
      consultation_update_input.specialty = data.department_id ? { connect: { id: data.department_id } } : undefined
      consultation_update_input.status = data.consultation_status ? { connect: { id: data.consultation_status } } : undefined

      try {
        await prisma.consultation.update({
          where: { id: consultation_id },
          data: consultation_update_input
        })

      } catch (err: any) {
        return exceptions({ err, res })
      }
    } catch (err: any) {
      return exceptions({ err, res })
    }

    return JsonMessages({
      statusCode: 200,
      message: 'Consulta Atualizada com Sucesso',
      res
    })
  }

  /**
   * 
   */
  async destroy(req: Request, res: Response) {
    const consultation_id_validation = id_parameter_schema.safeParse(Number(req.params.consultation_id))

    if (!consultation_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        data: {
          errors: consultation_id_validation.error.formErrors.formErrors
        },
        message: '',
        res
      })

    try {
      const consultation = await prisma.consultation.findUnique({
        where: { id: consultation_id_validation.data }
      })

      if (!consultation)
        return JsonMessages({
          statusCode: 200,
          message: 'Consulta não encontrada',
          data: {
            success: false
          },
          res
        })

      try {
        await prisma.consultation.delete({
          where: { id: consultation_id_validation.data }
        })

        return JsonMessages({
          statusCode: 200,
          message: 'Consulta apagada com sucesso',
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

  /**
   * 
   */
  async prescriptions(req: Request, res: Response) {
    const consultation_id_validation = id_parameter_schema.safeParse(req.params.consultation_id)

    if (!consultation_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        data: {
          errors: consultation_id_validation.error.formErrors.formErrors
        },
        message: '',
        res
      })

    try {
      const consultation = await prisma.consultation.findUnique({
        where: { id: consultation_id_validation.data },
        include: {
          prescription: true
        }
      })

      if (!consultation)
        return JsonMessages({
          statusCode: 200,
          message: 'Consulta não encontrada',
          res
        })

      return JsonMessages({
        statusCode: 200,
        message: '',
        data: consultation,
        res
      })
    } catch (err: any) {
      return exceptions({ err, res })
    }
  }
}

export default new ConsultationController()