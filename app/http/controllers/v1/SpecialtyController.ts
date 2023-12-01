import { Request, Response } from "express"
import exceptions from "../../../errors/handler"
import { PrismaClient } from "@prisma/client"
import { JsonMessages } from "../../../functions/function"

const prisma = new PrismaClient()

class SpecialtyController {
  async index(req: Request, res: Response) {
    try {
      const specialties = await prisma.medical_Specialty.findMany()

      return JsonMessages({
        statusCode: 200,
        message: 'Lista de Especialidades Medicas',
        data: specialties,
        res
      })

    } catch (err: any) {
      return exceptions({ err, res })
    }
  }
}

export default new SpecialtyController()