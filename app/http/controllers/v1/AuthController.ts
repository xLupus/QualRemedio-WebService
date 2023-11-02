import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { RegisterType } from '../../../types/type';
import { JsonMessages } from '../../../functions/function';

import exceptions from '../../../errors/handler';
import RegisterRequest from '../../requests/v1/RegisterRequest';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password, cpf, telephone, birth_day, doctorParams, carerParams, patientParams, account_type }: RegisterType = RegisterRequest.rules(req.body);
            const passwordHash: string = await bcrypt.hash(password, 15);

            let crm: any, crm_state: any, specialty_name: any, getMedicalSpecialtyId: any, entity: any;

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
                entity = {
                    ...user,
                    create: {
                        crm_state: doctorParams,
                        crm,
                        specialty: {
                            connect: { id: getMedicalSpecialtyId!.id }
                        }
                    }
                }  
            } else if(account_type === 'carer') {
                entity = {
                    ...user,
                    carer: {
                        create: {
                            specialty: {
                                connect: { id: getMedicalSpecialtyId!.id }
                            }
                        }
                    }  
                }
            }

            const createUser = await prisma.user.create({ data: entity });

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
}

export default new AuthController();