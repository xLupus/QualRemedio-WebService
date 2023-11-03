
import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { RegisterType } from '../../../types/type';
import { JsonMessages } from '../../../functions/function';
import exceptions from '../../../errors/handler';
import RegisterRequest from '../../requests/v1/RegisterRequest';
import bcrypt from 'bcrypt';
import LoginRequest from "../../requests/v1/LoginRequest";
import { JsonMessages as IRequestResponse } from "../../../types/type";
import { object } from "zod";

const prisma = new PrismaClient();

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password, cpf, telephone, birth_day, doctorParams, carerParams, patientParams, account_type }: RegisterType = RegisterRequest.rules(req.body);
            const passwordHash: string = await bcrypt.hash(password, 15);

            let crm: any, crm_state: any, specialty_name: any, getMedicalSpecialtyId: any;

            if(account_type === 'doctor') {
                crm = doctorParams.crm;
                crm_state = doctorParams.crm_state;
                specialty_name = doctorParams.specialty_name;
            } else if(account_type === 'carer') {
                specialty_name = carerParams.specialty_name;
            }

            if(account_type === 'doctor' || account_type === 'carer') {
                getMedicalSpecialtyId = await prisma.medical_Specialty.findFirst({
                    where: { name: specialty_name },
                    select: { id: true }
                });
            }

            const getUserRoleId = await prisma.role.findFirstOrThrow({
                where: { name: account_type },
                select: { id: true }
            });

            const checkUserRole = await prisma.user.findFirst({
                where: { 
                    name, 
                    email,
                    cpf, 
                    telephone, 
                    birth_day: birth_day.substring(0, 8), 
                    role_id: getUserRoleId!.id,
                    doctor: {
                        some: {
                            crm,
                            crm_state,
                            specialty_id: getMedicalSpecialtyId!.id
                        }
                    }
                }
            });

            if(checkUserRole) {
                return JsonMessages({
                    message: `User already exists`,
                    res
                });
            }

            let user: Prisma.UserCreateInput = {
                name,
                email,
                password: passwordHash,
                cpf,
                telephone,
                birth_day,
                role: {
                    connect: { id: getUserRoleId!.id }
                }
            };
 
            if(account_type === 'doctor') {
                user.doctor = {
                    create: {
                        crm_state: doctorParams,
                        crm,
                        specialty: {
                            connect: { id: getMedicalSpecialtyId!.id }
                        }
                    }
                }
            } else if(account_type === 'carer') {
                user.carer = {
                    create: {
                        specialty: {
                            connect: { id: getMedicalSpecialtyId!.id }
                        }
                    }
                }
            }

            const createUser = await prisma.user.create({ data: user });

            return JsonMessages({
                statusCode: 201,
                message: `User has been created`,
                data: createUser,
                res
            });
        } catch (error: unknown) {
            return exceptions(error, res);
        }
    }

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

export default new AuthController();
