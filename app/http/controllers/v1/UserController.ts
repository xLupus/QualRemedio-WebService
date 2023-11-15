import { Prisma, PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { JsonMessages } from "../../../functions/function"
import exceptions from "../../../errors/handler"
import bcrypt from "bcrypt"
import { change_password_schema, id_parameter_schema, paginate_schema } from "../../schemas";

const prisma = new PrismaClient();

class UserController {
  /**
   * @swagger
   * /users:
   *    get:
   *      summary: Retorna uma lista de usuarios
   * 
   *      tags:
   *        - Usuario
   * 
   *      parameters:
   *        - in: query
   *          name: filter
   *          schema:
   *            type: string
   * 
   *        - in: query
   *          name: sort
   *          schema:
   *            type: string
   * 
   *        - in: query
   *          name: skip
   *          schema:
   *            type: integer
   * 
   *        - in: query
   *          name: take
   *          schema:
   *            type: integer
   * 
   *      responses:
   *        "200": 
   *          description: Retorna uma lista de usuarios
   *    
   */
  async index(req: Request, res: Response) {
    const findmany_args: Prisma.UserFindManyArgs = {}

    const { filter, sort, skip, take } = req.query

    if (filter) {
      const available_filter_fields = ['name', 'email']

      filter.toString().split(',').map(filterParam => {
        const [filterColumn, filterValue] = filterParam.split(':')

        if (available_filter_fields.includes(filterColumn)) {
          if (filterColumn == 'name')
            findmany_args.where = {
              ...findmany_args.where,
              name: { contains: filterValue }
            }

          if (filterColumn == 'email')
            findmany_args.where = {
              ...findmany_args.where,
              email: { contains: filterValue }
            }
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
      const paginate_validation = paginate_schema.safeParse({ take, skip })

      if (paginate_validation.success) {
        findmany_args.take = paginate_validation.data.take
        findmany_args.skip = paginate_validation.data.skip
      }
    }

    //findmany_args.select = {} //TODO - Decidir quais campos retornar

    try {
      const users = await prisma.user.findMany(findmany_args)

      return JsonMessages({
        statusCode: 200,
        message: 'Lista de Usuarios',
        data: { users },
        res
      })
    } catch (err: any) {
      return exceptions(err, res)
    }
  }

  /**
   * @swagger
   * /users/{user_id}:
   *    get:
   *      summary: Retorna as informações de um usuario
   * 
   *      tags:
   *        - Usuario
   * 
   *      parameters:
   *        - in: path
   *          name: user_id
   *          required: true
   *          description: O id do Usuario
   *          schema:
   *            type: integer
   * 
   *      responses:
   *        "200": 
   *          description: Retorna as informações de um usuario
   *    
   */
  async show(req: Request, res: Response) {
    const { user_id } = req.params

    const user_id_validation = id_parameter_schema.safeParse(user_id)

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
        message: `Dados do Usuario de ID: ${user_id_validation.data}`,
        data: user,
        res
      })
    } catch (err) {
      return exceptions(err, res)
    }
  }

  /**
   * 
   * 
   */
  async update(req: Request, res: Response) {

  }

  /**
   * @swagger
   * /users/{user_id}:
   *    delete:
   *      summary: Deleta um usuario
   * 
   *      tags:
   *        - Usuario
   * 
   *      parameters:
   *        - in: path
   *          name: user_id
   *          required: true
   *          description: O id do Usuario
   *          schema:
   *            type: integer
   * 
   *      requestBody:
   *          description: Lorem Ipsum
   *          required: true
   *          content:
   *            application/json:
   *              
   * 
   *      responses:
   *        "200": 
   *          description: Retorna as informações de um usuario
   *    
   */
  async destroy(req: Request, res: Response) {
    const { user_id } = req.params
    const { password } = req.body

    const user_id_validation = id_parameter_schema.safeParse(user_id)

    if (!user_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        message: '',
        data: { errors: user_id_validation.error.formErrors.formErrors },
        res
      })

    try {
      const user = await prisma.user.findUnique({
        where: { id: user_id_validation.data }
      })

      if (!user)
        return JsonMessages({
          statusCode: 200,
          message: 'Usuario não encontrado',
          res
        })

      if (!await bcrypt.compare(password, user.password))
        return JsonMessages({
          statusCode: 200,
          message: 'Senhas não conhecidem',
          res
        })

      try {
        await prisma.user.delete({
          where: { id: user_id_validation.data }
        })

        return JsonMessages({
          statusCode: 200,
          message: 'Usuario apagado com sucesso',
          res
        })

      } catch (err: any) {
        return exceptions(err, res)
      }
    } catch (err: any) {
      return exceptions(err, res)
    }
  }

  /**
   * @swagger
   * /users/{user_id}/password:
   *    patch:
   *      summary: Altera a senha de um usuario
   * 
   *      tags:
   *        - Usuario
   * 
   *      parameters:
   *        - in: path
   *          name: user_id
   *          required: true
   *          description: O id do Usuario
   *          schema:
   *            type: integer
   * 
   *      requestBody:
   *          description: Lorem Ipsum
   *          required: true
   *          content:
   *            application/json:
   * 
   *      responses:
   *        "200": 
   *          description: Retorna as informações de um usuario
   *    
   */
  async change_password(req: Request, res: Response) {
    const { user_id } = req.params
    const { current_password, new_password } = req.body

    const [user_id_validation, new_password_validation] = await Promise.all([
      id_parameter_schema.safeParseAsync(user_id),

      change_password_schema.safeParseAsync({ current_password, new_password })
    ])

    if (!user_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        message: '',
        data: { errors: user_id_validation.error.formErrors.formErrors },
        res
      })


    if (!new_password_validation.success)
      return JsonMessages({
        statusCode: 200,
        message: '',
        data: { errors: new_password_validation.error.formErrors.fieldErrors },
        res
      })


    try {
      const user = await prisma.user.findUnique({
        where: { id: user_id_validation.data }
      })

      if (!user)
        return JsonMessages({
          statusCode: 200,
          message: 'Usuario não encontrado',
          res
        })

      if (!await bcrypt.compare(current_password, user.password))
        return JsonMessages({
          statusCode: 200,
          message: 'Senhas não conhecidem',
          res
        })

      try {
        await prisma.user.update({
          where: { id: user_id_validation.data },
          data: {
            password: await bcrypt.hash(new_password_validation.data.new_password, 15)
          }
        })

      } catch (err: any) {
        return exceptions(err, res)
      }
    } catch (err: any) {
      return exceptions(err, res)
    }

    return JsonMessages({
      statusCode: 200,
      message: 'Senha alterada com sucesso',
      res
    })
  }
}

export default new UserController()