import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import exceptions from '../../../errors/handler'
import { JsonMessages } from "../../../functions/function";
import ConsultationRequest from "../../requests/v1/ConsultationRequest";
import { id_parameter_schema } from "../../schemas";

const prisma = new PrismaClient()

class ConsultationController {
  async index(req: Request, res: Response) {
    try {
      const consultations = await prisma.consultation.findMany()

      return JsonMessages({
        statusCode: 200,
        message: 'Lista de Consultas',
        data: consultations,
        res
      })

    } catch (err: any) {
      return exceptions({ err, res })
    }
  }

  async store(req: Request, res: Response) {
    const bond_id_validation = id_parameter_schema.safeParse(req.params.bond_id)
    const consultation_validation = ConsultationRequest.rules(req.body)

    if (!bond_id_validation.success)
      return JsonMessages({
        statusCode: 200,
        message: '',
        res
      })

    if (!consultation_validation.success)
      return JsonMessages({
        statusCode: 200,
        message: '',
        res
      })

    const { reason, consultation_status, created_by_user, date, department_id, observation } = consultation_validation.data

    try {


    } catch (err: any) {
      return exceptions({ err, res })
    }
  }

  async update(req: Request, res: Response) { }

  async destroy(req: Request, res: Response) { }
}

export default new ConsultationController()