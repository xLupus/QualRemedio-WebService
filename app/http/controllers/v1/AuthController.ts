import 'dotenv/config'
import { PrismaClient, Token_Blacklist } from '@prisma/client'
import { Request, Response } from 'express'
import { JsonMessages, invalidateToken } from '../../../functions/function'
import { JsonMessages as IRequestResponse } from "../../../types/type"
import bcrypt from 'bcrypt'
import LoginRequest from "../../requests/v1/LoginRequest"
import jwt from 'jsonwebtoken'
import exceptions from "../../../errors/handler"

const prisma = new PrismaClient();

class AuthController {
  //TODO - Colocar os schemas no requestBody e Responses
  /**
   * @swagger
   * /auth/login:
   *    post:
   *      summary: Autentica um usuario no sistema
   * 
   *      tags:
   *        - Autenticação
   * 
   *      requestBody:
   *        required: true
   *        content: 
   *          application/json:
   *            schema:
   *              type: object
   * 
   *              properties:
   *                email:
   *                  type: string
   *                password:
   *                  type: string
   *                role:
   *                  type: integer
   * 
   *              required:
   *                - email
   *                - password
   *                - role
   * 
   *      responses:
   *        '200':
   *          description: Rever
   *          content:
   *            application/json:
   *              schema:
   *                type: object  
   *                properties:
   *                  status:
   *                    type: integer
   * 
   *                  message: 
   *                    type: string
   * 
   *                  data:
   *                    type: object
   * 
   *        '400':
   *          description: Rever
   *          content:
   *            application/json:
   *              schema:
   *                type: object  
   *                properties:
   *                  status:
   *                    type: integer
   * 
   *                  message: 
   *                    type: string
   * 
   *                  data:
   *                    type: object
   * 
   *        '500':
   *          description: Rever
   *          content:
   *            application/json:
   *              schema:
   *                type: object  
   *                properties:
   *                  status:
   *                    type: integer
   * 
   *                  message: 
   *                    type: string
   * 
   *                  data:
   *                    type: object
   *  
   */
  public async login(req: Request, res: Response) {
    const json_message: IRequestResponse = { message: "", res }
    const validation = LoginRequest.rules(req.body)

    if (!validation.success) {
      json_message.data = { errors: validation.error.formErrors.fieldErrors }
      return JsonMessages(json_message)
    }

    const { email, password, role } = validation.data

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
          role: { some: { id: role } }
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: {
            where: { id: role },
            select: { 
              id: true, 
              name: true, 
              description: true 
            }
          }
        },
      })

      if (!user || !await bcrypt.compare(password, user.password)) {
        json_message.statusCode = 400
        json_message.message = "Credenciais Invalidas"

        return JsonMessages(json_message)
      }

      const token_expires_in = '72h'

      const jwt_payload = {
        id: user.id,
        role: user.role[0]
      }

      const token = jwt.sign(
        jwt_payload,
        process.env.SECRET_KEY || 'secret',
        { expiresIn: token_expires_in }
      )

      json_message.statusCode = 200

      json_message.data = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role[0]
        },
        authorization: {
          type: 'bearer',
          token,
          expiresIn: token_expires_in
        }
      }

    } catch (err: any) {
      return exceptions(err, res)
    }

    return JsonMessages(json_message)
  }

  /**
   * @swagger
   * /auth/user:
   *    delete: 
   *      summary: Invalida um json web token
   * 
   *      tags:
   *        - Autenticação
   *      
   *      parameters:
   *        - in: header
   *          name: Authorization
   *          description: Um JWT bearer token
   *          schema:
   *            type: string
   *            format: JWT
   *          
   * 
   */
  public async logout(req: Request, res: Response) {
    //TODO - Rever authorization header
    const token = req.headers.authorization!.split(' ')[1]

    try {
      const t = await invalidateToken(token)

      return JsonMessages({
        message: 'User has been logged out',
        res
      });
    } catch (error: unknown) {
      console.log(error);
      return exceptions(error, res);
    }
  }

}

export default new AuthController();
