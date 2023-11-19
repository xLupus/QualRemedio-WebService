import { Prisma, PrismaClient, Bond, User, Bond_Status } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { JsonMessages } from '../../../functions/function';
import { i18n } from 'i18next';
import { BondType } from '../../../types/type';
import { BondResource } from '../../resources/v1/Bond/BondResource';

import exceptions from '../../../errors/handler';
import BondRequest from '../../requests/v1/BondRequest';
import StoreBondLinks from '../../resources/v1/hateoas/Bond/StoreBondLinks';
import DestroyBondLinks from '../../resources/v1/hateoas/Bond/DestroyBondLinks';
import ShowBondLinks from '../../resources/v1/hateoas/Bond/ShowBondLinks';
import IndexBondLinks from '../../resources/v1/hateoas/Bond/IndexBondLinks';
import UpdateBondLinks from '../../resources/v1/hateoas/Bond/UpdateBondLinks';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class BondController {
    //TODO: desenvolver um filtro aqui
    async index(req: Request, res: Response) {
        try {
            const translate: i18n = req.i18n;
            const user = req.user as any;
            const userRoleId: number = user.role[0].id;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const bonds = await prisma.bond.findMany({
                where: {
                    OR: [
                        {
                            from_role: { id: userRoleId }
                        },
                        {
                            to_role: { id: userRoleId }
                        }
                    ],
                    AND: [
                        {
                            OR: [
                                {
                                    from: { id: user.id }
                                },
                                {
                                    to: { id: user.id }
                                }
                            ]
                        }
                    ]
                },
                select: {
                    id: true,
                    from_user: true,
                    to: {
                        include: {
                            doctor: userRoleId === 2 && true,
                            carer: userRoleId === 3 && true
                        }
                    },
                    status_id: true
                }
            });

            if(bonds.length === 0) {
                return JsonMessages({
                    message: translate.t('error.bond.notFound'),
                    res
                });
            }

            return JsonMessages({
                message: translate.t('success.bond.returned'),
                data: new BondResource(bonds, req.method),
                _links: IndexBondLinks._links(),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    async show(req: Request, res: Response) {
        try {
            const translate: i18n = req.i18n;
            const { bond_id }: BondType = BondRequest.rules({ bond_id: Number(req.params.id) }, translate, req.method);

            const user = req.user as any;
            const userRoleId: number = user.role[0].id;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const bond = await prisma.bond.findUniqueOrThrow({
                where: { 
                    id: bond_id,
                    OR: [
                        {
                            from_role: { id: userRoleId }
                        },
                        {
                            to_role: { id: userRoleId }
                        }
                    ],
                    AND: [
                        {
                            OR: [
                                {
                                    from: { id: user.id }
                                },
                                {
                                    to: { id: user.id }
                                }
                            ]
                        }
                    ]
                },
                select: {
                    id: true,
                    from_user: true,
                    to: {
                        include: {
                            doctor: userRoleId === 2 && true,
                            carer: userRoleId === 3 && true
                        }
                    },
                    status_id: true
                }
            });

            return JsonMessages({
                message: translate.t('success.bond.returned'),
                data: new BondResource(bond, req.method),
                _links: ShowBondLinks._links(bond_id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    async store(req: Request, res: Response) {
        try {
            const translate: i18n = req.i18n;
            const { user_to_id, user_to_role_id }: BondType = BondRequest.rules(req.body, translate);
            
            const user = req.user as any;
            const userRoleId: number = user.role[0].id;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            await prisma.role.findUniqueOrThrow({ where: { id: user_to_role_id } });

            const toUser = await prisma.user.findUnique({
                where: { id: user_to_id },
                include: {
                    role: {
                        where: { id: user_to_role_id }
                    }
                }
            }); //finds the user which the bond was sent

            if(!toUser) {
                return JsonMessages({
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const toUserRoleId: number = toUser.role[0].id;

            if(toUser.id === user.id) {
                return JsonMessages({
                    message: translate.t('error.bond.user.equals'),
                    res
                });
            } else if(toUserRoleId === userRoleId) {
                return JsonMessages({
                    message: translate.t('error.bond.user.roleEquals'),
                    res
                });
            } else if((userRoleId === 2 || userRoleId === 3) && (toUserRoleId === 3 || toUserRoleId === 2)) {
                return JsonMessages({
                    message: translate.t('error.bond.user.onlyPatient'),
                    res
                });
            }

            const userBondExists: Bond | null = await prisma.bond.findFirst({
                where: {
                    OR: [
                        {
                            OR: [
                                {
                                    from_role: { id: userRoleId }
                                },
                                {
                                    from_role: { id: toUserRoleId }
                                }
                            ]
                        },
                        {
                            OR: [
                                {
                                    to_role: { id: userRoleId }
                                },
                                {
                                    to_role: { id: toUserRoleId }
                                }
                            ]
                        }
                    ],
                    AND: [
                        {
                            OR: [
                                {
                                    OR: [
                                        {
                                            from: { id: user.id }
                                        },
                                        {
                                            from: { id: toUser.id }
                                        }
                                    ]
                                },
                                {
                                    OR: [
                                        {
                                            to: { id: user.id }
                                        },
                                        {
                                            to: { id: toUser.id }
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    status: {
                        OR: [
                            {
                                id: 1
                            },
                            {
                                id: 2
                            }
                        ]     
                    }
                }
            });
            
            if(userBondExists) {
                return JsonMessages({
                    message: translate.t('error.bond.exists'),
                    res
                });
            }
console.log(userBondExists);

         
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const translate: i18n = req.i18n;
            const { bond_id, status_id }: BondType = BondRequest.rules({ bond_id: Number(req.params.id), status_id: req.body.status_id }, translate, req.method);

            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            await prisma.bond.findUniqueOrThrow({ //find an userTo - bond
                where: { 
                    id: bond_id,
                    to: { id: user.id }
                }
            });

            const bondStatus: Bond_Status | null = await prisma.bond_Status.findUniqueOrThrow({ where: { id: status_id } });

            const currentBondStatus: Bond | null = await prisma.bond.findUnique({
                where: { 
                    id: bond_id,
                    OR: [
                        {
                            status_id: 2
                        },
                        {
                            status_id: 3
                        }
                    ]
                }
            });

            if(currentBondStatus) {
                return JsonMessages({
                    message: translate.t('error.bond.status.cannotBeChanged'),
                    res
                });
            }

            const updateBondStatus = await prisma.bond.update({
                data: {
                    status: {
                        connect: { id: bondStatus.id }
                    }
                },
                where: { id: bond_id },

            });

            console.log(updateBondStatus);
            
            return JsonMessages({
                message: translate.t('success.bond.updated'),
                data: new BondResource(updateBondStatus),
                _links: UpdateBondLinks._links(bond_id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    async destroy(req: Request, res: Response) {
        try {
            const translate: i18n = req.i18n;
            const { bond_id }: BondType = BondRequest.rules({ bond_id: Number(req.params.id) }, translate, req.method);
            
            const user = req.user as any;
        
            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            await prisma.bond.findUniqueOrThrow({ 
                where: { 
                    id: bond_id,
                    status: {
                        OR: [
                            {
                                id: 2
                            },
                            {
                                id: 3
                            }
                        ]
                    }
                }
            }); //find an user bond

            const removeBond = await prisma.user.update({
                data: {
                    bond_started_by: {
                        delete: { id: bond_id }
                    }
                },
                where: { id: user.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    birth_day: true,
                    telephone: true
                }
            });

            return JsonMessages({
                message: translate.t('success.bond.deleted'),
                data: new BondResource(removeBond),
                _links: DestroyBondLinks._links(),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new BondController();