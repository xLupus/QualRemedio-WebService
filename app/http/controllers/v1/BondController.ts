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
import { ShowBondResource } from '../../resources/v1/Bond/ShowBondResource';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class BondController {
    async index(req: Request, res: Response) {
        try {
            const translate: i18n = req.i18n;
            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const bonds: Bond[] | null = await prisma.bond.findMany({
                where: {
                    from: { id: user.id }
                },
                include: { to: true }
            });

            if(bonds.length === 0) {
                return JsonMessages({
                    message: translate.t('error.bond.notFound'),
                    res
                });
            }

            return JsonMessages({
                message: translate.t('success.bond.returned'),
                data: bonds,
               // data: new RegisterResource(createUser),
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

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const bond = await prisma.bond.findUnique({
                where: { 
                    id: bond_id,
                    from: { id: user.id }
                },
                select: {
                    id: true,
                    from_user: true,
                    to_user: true,
                    status_id: true
                }
            });

            if(!bond) {
                return JsonMessages({
                    message: translate.t('error.bond.notFound'),
                    res
                });
            }

            return JsonMessages({
                message: translate.t('success.bond.returned'),
                data: new ShowBondResource(bond),
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
            const { user_to_id }: BondType = BondRequest.rules(req.body, translate);
            
            const user = req.user as any;
        
            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const userTo: User | null = await prisma.user.findUnique({ where: { id: user_to_id }});

            if(!userTo) {
                return JsonMessages({
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const createUserBond = await prisma.user.update({
                data: {
                    bond_started_by: {
                        create: {
                            to: {
                                connect: {
                                    id: user_to_id
                                }
                            },
                            status: {
                                connect: { id: 1 }
                            }
                        }
                    }
                },
                where: { id: user.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    birth_day: true
                }
            });

            return JsonMessages({
                statusCode: 201,
                message: translate.t('success.bond.created'),
                data: new BondResource(createUserBond),
                _links: StoreBondLinks._links(createUserBond.id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const translate: i18n = req.i18n;
            const { bond_id, status_id }: BondType = BondRequest.rules({ bond_id: Number(req.params.id) }, translate);

            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const bond: Bond | null = await prisma.bond.findUnique({
                where: { 
                    id: bond_id,
                    from: { id: user.id }
                }
            });

            if(!bond) {
                return JsonMessages({
                    message: translate.t('error.bond.notFound'),
                    res
                });
            }

            const bondStatus: Bond_Status | null = await prisma.bond_Status.findUniqueOrThrow({ where: { id: status_id } });

            const updateBond = await prisma.bond.update({
                data: {
                    status: {
                        connect: {
                            id: bondStatus.id
                        }
                    }
                },
                where: { id: bond_id }
            });

            return JsonMessages({
                message: translate.t('success.bond.updated'),
                data: updateBond,
                _links: ShowBondLinks._links(bond_id),
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

            const bond: User | null = await prisma.user.findUnique({ where: { id: bond_id }});

            if(!bond) {
                return JsonMessages({
                    message: translate.t('error.bond.notFound'),
                    res
                });
            }

            const removeBond = await prisma.user.update({
                data: {
                    bond_started_by: {
                        delete: {
                            id: bond_id
                        }
                    }
                },
                where: { id: user.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    birth_day: true
                }
            });

            return JsonMessages({
                message: translate.t('success.bond.deleted'),
                data: new BondResource(removeBond),
                _links: DestroyBondLinks._links(bond_id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new BondController();