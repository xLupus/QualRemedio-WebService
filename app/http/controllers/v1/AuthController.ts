import { Prisma, PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';
import { RegisterType } from '../../../types/type';
import { JsonMessages } from '../../../functions/function';
import { RegisterResource } from '../../resources/v1/Auth/RegisterResource';

import exceptions from '../../../errors/handler';
import bcrypt from 'bcrypt';
import RegisterRequest from '../../requests/v1/RegisterRequest';
import RegisterLinks from '../../resources/v1/hateoas/Auth/RegisterLinks';

const prisma = new PrismaClient();

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password, cpf, telephone, birth_day, crm, crm_state, specialty_name, account_type }: RegisterType = RegisterRequest.rules(req.body, req.i18n);
            const passwordHash: string = await bcrypt.hash(password, 15);
            let MedicalSpecialtyId: { id: number } = { id: 0 };

            const roleId = await prisma.role.findFirstOrThrow({
                where: { name: account_type },
                select: { id: true }
            });

            if(account_type === 'doctor' || account_type === 'carer') {
                MedicalSpecialtyId = await prisma.medical_Specialty.findFirstOrThrow({
                    where: { name: specialty_name },
                    select: { id: true }
                });              
            }
        
            const checkUser: User | null = await prisma.user.findUnique({ where: { email } });

            if(checkUser) {
                const checkUserRole: User | null = await prisma.user.findUnique({
                    where: {
                        email,
                        role: { some: { id: roleId!.id } }
                    }
                });

                if(!checkUserRole) {
                    if(account_type === 'doctor' && (crm && crm_state)) {
                        await prisma.user.update({
                            where: { email },
                            data: {
                                role: {
                                    connect: {
                                        id: roleId!.id
                                    }
                                },
                                doctor: {
                                    create: {
                                        crm_state,
                                        crm,
                                        specialty: {
                                            connect: { id: MedicalSpecialtyId!.id }
                                        }
                                    }
                                }                
                            }
                        });
                    } else if(account_type === 'carer') {
                        await prisma.user.update({
                            where: { email },
                            data: {
                                role: {
                                    connect: {
                                        id: roleId!.id
                                    }
                                },
                                carer: {
                                    create: {
                                        specialty: {
                                            connect: { id: MedicalSpecialtyId!.id }
                                        }
                                    }
                                }                
                            }
                        });
                    } else {
                        await prisma.user.update({
                            where: { email },
                            data: {
                                role: {
                                    connect: {
                                        id: roleId!.id
                                    }
                                }              
                            }
                        });
                    }

                    return JsonMessages({
                        message: req.i18n.t('success.user.created'),
                        res
                    });   
                }

                return JsonMessages({
                    message: req.i18n.t('error.user.exists'),
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
                    connect: { id: roleId!.id }
                },
                profile: {
                    create: {
                        bio: 'Tell us a little bit about yourself',
                        picture_url: 'https://placehold.co/120x120/png'
                    }
                }
            };

            if(account_type === 'doctor' && (crm && crm_state)) {
                user.doctor = {
                    create: {
                        crm_state,
                        crm,
                        specialty: {
                            connect: { id: MedicalSpecialtyId!.id }
                        }
                    }
                }
            } else if(account_type === 'carer') {
                user.carer = {
                    create: {
                        specialty: {
                            connect: { id: MedicalSpecialtyId!.id }
                        }
                    }
                }
            }

            const createUser = await prisma.user.create({ 
                data: user,
                include: {
                    doctor: true,
                    carer: true
                }
            });
            
            return JsonMessages({
                statusCode: 201,
                message: req.i18n.t('success.user.created'),
                data: new RegisterResource(createUser),
                _links: RegisterLinks._links(),
                res
            });
        } catch (error: unknown) {
            return exceptions({error, req, res});
        }
    }
}

export default new AuthController();