import { Prisma, PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { JsonMessages } from "../../../functions/function"
import exceptions from "../../../errors/handler"
import bcrypt from "bcrypt"
import { change_password_schema, id_parameter_schema, paginate_schema, email_schema, role_schema } from "../../schemas";
import { JsonMessages as IResponseMessage } from "../../../types/type"
import UpdateUserRequest from "../../requests/v1/User/UpdateUserRequest"
import { SafeParseReturnType } from "zod"

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

    const json_message: IResponseMessage = {
      statusCode: 200,
      message: 'Lista de Usuarios',
      data: {},
      res
    }

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

    try {
      const total_users = await prisma.user.findMany({
        where: findmany_args.where
      })

      json_message.data = {
        total_users: total_users.length
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

      //findmany_args.select = {} //TODO - Decidir quais campos retornar

      try {
        const users = await prisma.user.findMany(findmany_args)

        json_message.data = {
          ...json_message.data as object,
          users
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
    const { id, email, role } = req.body;
    let id_validation: any;
    let role_validation: any;

    const email_validation = email_schema.safeParse(email);

    if(id) {
      id_validation = id_parameter_schema.safeParse(Number(id));
      if (!id_validation.success) {
        return JsonMessages({
          statusCode: 200,
          message: '',
          data: {
            errors: id_validation.error.formErrors.formErrors
          },
          res
        })
      }
    } else if(role) {
      role_validation = role_schema.safeParse(Number(role));
      
    if (!role_validation.success) {
     
      return JsonMessages({
        statusCode: 200,
        message: 'number',
        data: {
          errors: role_validation.error.formErrors.formErrors
        },
        res
      })
    }

    }

    if (!email_validation.success) {
      return JsonMessages({
        statusCode: 200,
        message: '',
        data: {
          errors: email_validation.error.formErrors.formErrors
        },
        res
      })
    }

    try {
      let findFirstArgs: Prisma.UserFindFirstArgs = {};

      if(id) {
        findFirstArgs = {
            where: {  
              id: id_validation.data,
            }
        }

      } else if(role){
        console.log('oi')
        findFirstArgs = {
          where: {  
            email:  email_validation.data,
            role: {
              some: {
                  id: role_validation.data
              }
            }
          }
        }
      }
 
      const user = await prisma.user.findFirst({
          where: findFirstArgs.where,
          include: {
            profile: true,
            role: true,
            carer: {
              include: {
                specialty: true
              }
            },
            doctor: {
              include: {
                specialty: true
              }
            }
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
        message: 'Usuário retornado com sucesso!',
        data: user,
        res
      })
    } catch (err) {
      return exceptions({ err, res })
    }
  }

  /**
   * 
   * 
   */
  async update(req: Request, res: Response) {
    const user_update_input: Prisma.UserUpdateInput = {}

    const user_id_validation = id_parameter_schema.safeParse(Number(req.params.user_id))

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

    const user_data_validation = await UpdateUserRequest.rules(req.body)

    if (!user_data_validation.success)
      return JsonMessages({
        statusCode: 200,
        message: '',
        data: {
          success: false,
          errors: user_data_validation.error.formErrors.fieldErrors
        },
        res
      })

    const user_id = user_id_validation.data
    const user_data = user_data_validation.data

    try {
      const user = await prisma.user.findUnique({
        where: { id: user_id }
      })

      if (!user)
        return JsonMessages({
          statusCode: 200,
          message: 'Usuario não encontrado',
          data: {
            success: false
          },
          res
        })

      user_update_input.name = user_data.name ?? undefined
      user_update_input.telephone = user_data.telephone?.toString() ?? undefined
      user_update_input.birth_day = user_data.birth_day ?? undefined
      user_update_input.profile = user_data.profile?.bio
        ? {
          update: {
            bio: {
              set: user_data.profile.bio
            }
          }
        }
        : undefined

      try {
        await prisma.user.update({
          where: { id: user_id },
          data: user_update_input
        })
      } catch (err: any) {
        return exceptions({ err, res })
      }

    } catch (err: any) {
      return exceptions({ err, res })
    }

    return JsonMessages({
      statusCode: 200,
      message: 'Usuario Atualizado com Sucesso',
      data: {
        success: true,
        user_data
      },
      res
    })

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
        return exceptions({ err, res })
      }
    } catch (err: any) {
      return exceptions({ err, res })
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
        data: {
          success: false,
          errors: {
            user_id: user_id_validation.error.formErrors.formErrors
          }
        },
        res
      })


    if (!new_password_validation.success)
      return JsonMessages({
        statusCode: 200,
        message: '',
        data: {
          success: false,
          errors: new_password_validation.error.formErrors.fieldErrors
        },
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
          data: {
            success: false,
            errors: {
              user_id: 'Usuario não encontrado',
            }
          },
          res
        })

      if (!await bcrypt.compare(current_password, user.password))
        return JsonMessages({
          statusCode: 200,
          message: 'Senhas não conhecidem',
          data: {
            success: false,
            errors: {
              change_password: 'Senhas não conhecidem',
            }
          },
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
        return exceptions({ err, res })
      }
    } catch (err: any) {
      return exceptions({ err, res })
    }

    return JsonMessages({
      statusCode: 200,
      message: 'Senha alterada com sucesso',
      data: {
        success: true,
      },
      res
    })
  }

  async consultations(req: Request, res: Response) {

  }

}

export default new UserController()