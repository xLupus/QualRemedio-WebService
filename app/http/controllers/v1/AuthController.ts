import { Request, Response } from "express";
import LoginRequest from "../../requests/v1/LoginRequest";
import { PrismaClient } from '@prisma/client'
import { JsonMessages } from "../../../functions/function";
import { JsonMessages as IRequestResponse } from "../../../types/type";
import { object } from "zod";

const prisma = new PrismaClient();

class AuthController {
  async login(req: Request, res: Response) {
    const json_message: IRequestResponse = { message: "", res }
    const validation = LoginRequest.rules(req.body)

    if (!validation.success) {
      return res.json({
        message: 'mudar msg'
      })
    }

    const { email, password } = validation.data

    try {
      const user = await prisma.user.findUnique({ where: { email } })

      if(user){
        json_message.data = user
      }

    } catch (err: any) {
      console.log(err) // TODO - Mudar
    }

    return JsonMessages(json_message)
  }
}

export default new AuthController()