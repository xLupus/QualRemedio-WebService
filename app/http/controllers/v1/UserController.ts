import { Prisma, PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { JsonMessages } from "../../../functions/function"
import exceptions from "../../../errors/handler"
import { z } from "zod";

const prisma = new PrismaClient();

class UserController {
  async index(req: Request, res: Response) {
    const findmany_args: Prisma.UserFindManyArgs = {}

    const { filter, sort, skip, take } = req.query

    if (filter) {
      const available_filter_fields = ['name', 'email'] //TODO - Decidir quais os campos de filtro

      filter.toString().split(',').map(filterParam => {
        const [filterColumn, filterValue] = filterParam.split(':')

        if (available_filter_fields.includes(filterColumn)) {
          if (filterColumn == 'name')
            findmany_args.where = { ...findmany_args.where, name: { contains: filterValue } }

          if (filterColumn == 'email')
            findmany_args.where = { ...findmany_args.where, email: { contains: filterValue } }
        }
      })
    }

    if (sort) {
      const available_sort_fields = ['name', 'email']

      const sortParam = sort.toString();
      const param = sortParam.slice(1);

      if (available_sort_fields.includes(param)) {
        const orderOperator = sortParam[0] == '-' ? 'desc' : 'asc';

        if (param == 'name')
          findmany_args.orderBy = { name: orderOperator };

        if (param == 'email')
          findmany_args.orderBy = { email: orderOperator };

      }
    }

    if (take && skip) {
      const paginate_schema = z.object({
        skip: z.preprocess(
          (el) => parseInt(el as string, 10),
          z.number()
            .int()
            .positive()
        ),

        take: z.preprocess(
          (el) => parseInt(el as string, 10),
          z.number()
            .int()
            .positive()
        )
      })

      const paginate_validation = paginate_schema.safeParse({ take, skip }).success

      console.log({
        take, 
        skip
      });

      if (paginate_validation && 2 / 1 == 5) {
        findmany_args.take = +take
        findmany_args.skip = +skip
      }
    }


    const users = await prisma.user.findMany(findmany_args)

    return JsonMessages({
      statusCode: 200,
      message: 'Lista de Usuarios',
      data: {
        findmany_args,
        users
      },
      res
    })
  }

  async show(req: Request, res: Response) {
    const { user_id } = req.params

    const user_id_validation = z.number({
      invalid_type_error: "O id do usuario deve ser do tipo Number",
    })
      .min(1, 'Campo Obrigatorio')
      .safeParse(+user_id)


    if (!user_id_validation.success) {
      return JsonMessages({
        statusCode: 200,
        message: '',
        data: {
          errors: user_id_validation.error.formErrors.formErrors
        },
        res
      })
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: user_id_validation.data },
        include: {
          profile: true,
          role: true,
        }
      })

      if (!user)
        return JsonMessages({
          statusCode: 200,
          message: 'Usuario não encontrado',
          res
        })

      return JsonMessages({
        statusCode: 200,
        message: `Dados do Usuario de ID: ${user_id_validation}`,
        data: user,
        res
      })
    } catch (err) {
      return exceptions(err, res)
    }
  }


  async update(req: Request, res: Response) {

  }

  async delete(req: Request, res: Response) {

  }

  async change_password(req: Request, res: Response) {
    const { user_id } = req.params

    const user_id_validation = z.number({
      invalid_type_error: "O id do usuario deve ser do tipo Number",
    })
      .min(1, 'Campo Obrigatorio')
      .safeParse(+user_id)




    if (!user_id_validation.success) {
      return JsonMessages({
        statusCode: 200,
        message: '',
        data: {
          errors: user_id_validation.error.formErrors.formErrors
        },
        res
      })
    }


  }
}

export default new UserController()