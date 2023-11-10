import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { JsonMessages } from '../../functions/function'

const prisma = new PrismaClient()

/**
 * 
 */
export function is(rolesRoutes: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const auth_token = req.headers.authorization;

    if (!auth_token) { //TODO - Alterar dps
      return JsonMessages({
        statusCode: 400, //TODO - Mudar
        message: 'Token de autorização necessario',
        res
      })
    }

    const [prefix, token] = auth_token.split(' ');

    let token_data = jwt.decode(token, { json: true });

    if (!token_data) { //TODO - Alterar dps
      return JsonMessages({
        statusCode: 400, //TODO - Mudar
        message: 'Token de autorização Vazio',
        res
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: token_data.id,
        role: { some: { id: token_data.role.id } }
      },
      include: {
        role: {
          where: { id: token_data.role.id }
        }
      }
    })

    if (!user) { //TODO - Alterar dps
      return JsonMessages({
        statusCode: 400, //TODO - Mudar
        message: 'Usuario não encontrado',
        res
      })
    }

    rolesRoutes = rolesRoutes.map(e => e.toLowerCase())
    
    const roleExist: Boolean = user.role.map(role => role.name).some(role => rolesRoutes.includes(role.toLowerCase()))

    if (!roleExist) {
      return JsonMessages({
        statusCode: 400, //TODO - Mudar
        message: 'O usuario não possui autorização',
        res
      })
    }

    return next();
  }
}

/**
 * 
 */
export function can(permissionsRoutes: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const auth_token = req.headers.authorization;

    if (!auth_token) { //TODO - Alterar dps
      return JsonMessages({
        statusCode: 400, //TODO - Mudar
        message: 'Token de autorização necessario',
        res
      })
    }

    const [prefix, token] = auth_token.split(' ');

    let token_data = jwt.decode(token, { json: true });

    if (!token_data) { //TODO - Alterar dps
      return JsonMessages({
        statusCode: 400, //TODO - Mudar
        message: 'Token de autorização Vazio',
        res
      })
    }

    const user_role = await prisma.role.findUnique({
      where: {
        id: token_data.role.id,
        user: { some: { id: token_data.id } },
      },
      select: {
        role_permission: {
          select: {
            permission: true
          }
        }
      }
    })

    if (!user_role) { //TODO - Alterar dps
      return JsonMessages({
        statusCode: 400, //TODO - Mudar
        message: 'Usuario não encontrado',
        res
      })
    }

    permissionsRoutes = permissionsRoutes.map(permission => permission.toLowerCase())

    const hasPermission = user_role.role_permission
      .map(role_permission => role_permission.permission.name)
      .some(permission => permissionsRoutes.includes(permission.toLowerCase()))

    if (!hasPermission) {
      return JsonMessages({
        statusCode: 400, //TODO - Mudar
        message: 'O usuario não possui autorização',
        res
      })
    }

    return next();
  }
}