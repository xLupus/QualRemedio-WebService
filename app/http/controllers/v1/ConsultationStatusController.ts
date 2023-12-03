import { Request, Response } from "express";
import exceptions from "../../../errors/handler";
import { PrismaClient } from "@prisma/client";
import { JsonMessages } from "../../../functions/function";

const prisma = new PrismaClient()

class ConsultationStatusController {
  async index(req: Request, res: Response) {
    try {
      const status = await prisma.consultation_Status.findMany()

      return JsonMessages({
        statusCode: 200,
        message: 'Lista de Status para Consultas',
        data: status,
        res
      })

    } catch (err) {
      exceptions({ err, res })
    }
  }
}

export default new ConsultationStatusController()