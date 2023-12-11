import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { RegisterType } from '../../../types/type';
import { JsonMessages, invalidateToken } from '../../../functions/function';
import { RegisterResource } from '../../resources/v1/Auth/RegisterResource';

import { i18n } from 'i18next';

import RegisterRequest from '../../requests/v1/RegisterRequest';
import RegisterLinks from '../../resources/v1/hateoas/Auth/RegisterLinks';
import LoginRequest from "../../requests/v1/LoginRequest";
import exceptions from '../../../errors/handler';
import bcrypt from 'bcrypt';

import 'dotenv/config';

import { JsonMessages as IRequestResponse } from "../../../types/type";
import jwt from 'jsonwebtoken';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class AuthController {
    async register(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { name, email, password, cpf, telephone, birth_day, crm, crm_state, specialty_name, account_type }: RegisterType = RegisterRequest.rules(req.body, translate);

            const passwordHash: string = await bcrypt.hash(password, 15);

            let medicalSpecialtyId: { id: number } = { id: 0 };
            let checkUser: Prisma.UserWhereInput;
            let user: Prisma.UserCreateInput | User[] | null;
            let data: Prisma.UserUpdateInput;

            const roleId: { id: number } = await prisma.role.findFirstOrThrow({
                where: { id: account_type },
                select: { id: true }
            });

            if (account_type === 2 || account_type === 3) {
                medicalSpecialtyId = await prisma.medical_Specialty.findFirstOrThrow({
                    where: { name: specialty_name },
                    select: { id: true }
                });
            }

            checkUser = {
                OR: [
                    {
                        email
                    },
                    {
                        telephone
                    }
                ]
            };

            if (account_type === 2) {
                checkUser.OR?.push({
                    doctor: {
                        some: {
                            crm: crm ? crm : '',
                            crm_state: crm_state ? crm_state : ''
                        }
                    }
                });
            }

            user = await prisma.user.findFirst({ where: checkUser });

            if (user) {
                checkUser.role = { some: { id: roleId!.id } } //role

                data = { //data
                    role: {
                        connect: {
                            id: roleId!.id
                        }
                    }
                }

                const checkUserWithRole: User | null = await prisma.user.findFirst({ where: checkUser });

                if (!checkUserWithRole) {
                    if (account_type === 2 && (crm && crm_state)) {
                        data.doctor = {
                            create: {
                                crm_state,
                                crm,
                                specialty: {
                                    connect: { id: medicalSpecialtyId!.id }
                                }
                            }
                        }
                    } else if (account_type === 3) {
                        data.carer = {
                            create: {
                                specialty: {
                                    connect: { id: medicalSpecialtyId!.id }
                                }
                            }
                        }
                    }

                    await prisma.user.update({
                        where: { email: user.email },
                        data
                    });

                    return JsonMessages({
                        statusCode: 201,
                        message: translate.t('success.user.created'),
                        res
                    });
                }

                if (!user?.is_verified) {
                    await prisma.user.update({
                        where: { id: checkUserWithRole.id },
                        data: { email }
                    });

                    return JsonMessages({
                        statusCode: 201,
                        message: translate.t('success.user.created'),
                        res
                    });
                }

                return JsonMessages({
                    message: translate.t('error.user.exists'),
                    res
                });
            }

            user = {
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
                        bio: translate.t('data.user.bio'),
                        picture_url: 'https://placehold.co/120x120/png'
                    }
                }
            };

            if (account_type === 2) {
                user.doctor = {
                    create: {
                        crm_state: crm_state ? crm_state : '',
                        crm: crm ? crm : '',
                        specialty: {
                            connect: { id: medicalSpecialtyId!.id }
                        }
                    }
                }
            } else if (account_type === 3) {
                user.carer = {
                    create: {
                        specialty: {
                            connect: { id: medicalSpecialtyId!.id }
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
                message: translate.t('success.user.created'),
                data: new RegisterResource(createUser),
                _links: RegisterLinks._links(),
                res
            });
        } catch (err: unknown) {
            return exceptions({ err, req, res });
        }
    }

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
    async login(req: Request, res: Response) {
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
                    is_verified: true,
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

            if (!user?.is_verified) {
                json_message.statusCode = 400;
                json_message.message = "Sua conta ainda não foi verificada, olhe em sua caixa de entrada o link de verificação"

                return JsonMessages(json_message)
            }

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
            console.log(req.i18n);

            return exceptions({ err, res })
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
            invalidateToken(token);

            return JsonMessages({
                message: 'User has been logged out',
                res
            });
        } catch (err: unknown) {
            return exceptions({ err, res });
        }
    }

}

export default new AuthController();
