import { Prisma, PrismaClient, Bond, Bond_Status } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { JsonMessages } from '../../../functions/function';
import { i18n } from 'i18next';
import { BondType, QueryParamsType } from '../../../types/type';
import { BondResource } from '../../resources/v1/Bond/BondResource';

import exceptions from '../../../errors/handler';
import BondRequest from '../../requests/v1/BondRequest';
import DestroyBondLinks from '../../resources/v1/hateoas/Bond/DestroyBondLinks';
import StoreBondLinks from '../../resources/v1/hateoas/Bond/StoreBondLinks';
import ShowBondLinks from '../../resources/v1/hateoas/Bond/ShowBondLinks';
import IndexBondLinks from '../../resources/v1/hateoas/Bond/IndexBondLinks';
import UpdateBondLinks from '../../resources/v1/hateoas/Bond/UpdateBondLinks';
import QueryParamsRequest from '../../requests/v1/QueryParamsRequest';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class BondController {
    async index(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { filter, sort, skip, take }: QueryParamsType = QueryParamsRequest.rules(req.query, translate);
        
            const user = req.user as any;
            const userRoleId: number = user.role[0].id;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const findManyArgs: Prisma.BondFindManyArgs = {
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
                    from_user_role: true,
                    to_user_role: true,
                    from_user: true,
                    to_user: true,
                    from: {
                        include: {
                            doctor: true,
                            carer: true
                        }
                    },
                    to: {
                        include: {
                            doctor: true,
                            carer: true
                        }
                    },
                    status_id: true
                }
            };
           
            if(filter) {
                const availableFilterFields: string[] = ['status'];
        
                filter.toString().split(',').map(filterParam => {
                    const [filterColumn, filterValue]: string[] = filterParam.split(':');
            
                    if (availableFilterFields.includes(filterColumn)) {
                        if (filterColumn === 'status') {
                            findManyArgs.where = {
                                ...findManyArgs.where,
                                status_id: Number(filterValue)
                            }
                        }
                    }
                })
            }
        
            if(sort) {
                const availableSortFields: string[] = ['id'];
                const sortParam: string = sort.toString();
                const param: string = sortParam.slice(1);
        
                if (availableSortFields.includes(param)) {
                    const orderOperator: 'desc' | 'asc' = sortParam[0] === '-' ? 'desc' : 'asc';
            
                    if (param === 'id') findManyArgs.orderBy = { id: orderOperator };
                }
            }

            if(take || skip) {              
                findManyArgs.take = take;
                findManyArgs.skip = skip;
            }

            const bonds: Bond[] | null = await prisma.bond.findMany(findManyArgs);

            if(bonds.length === 0) {
                return JsonMessages({
                    message: translate.t('error.bond.notFound'),
                    res
                });
            }

            return JsonMessages({
                message: translate.t('success.bond.returned'),
                data: new BondResource({ data: bonds, userId: user.id }, req.method),
                _links: IndexBondLinks._links(),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    async show(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
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

            const bond = await prisma.bond.findUnique({
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
                    from_user_role: true,
                    to_user_role: true,
                    from_user: true,
                    to_user: true,
                    from: {
                        include: {
                            doctor: true,
                            carer: true
                        }
                    },
                    to: {
                        include: {
                            doctor: true,
                            carer: true
                        }
                    },
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
                data: new BondResource({ data: bond, userId: user.id }, req.method),
                _links: ShowBondLinks._links(bond_id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    async store(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
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

            const userBond: Bond | null = await prisma.bond.findFirst({
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
                                    from_role: { id: toUserRoleId }
                                },               
                                {
                                    to_role: { id: toUserRoleId }
                                } 
                            ]
                        },
                        {
                            OR: [
                                {
                                    from: { id: user.id }
                                },               
                                {
                                    to: { id: user.id }
                                } 
                            ]
                        },
                        {
                            OR: [
                                {
                                    from: { id: toUser.id }
                                },               
                                {
                                    to: { id: toUser.id }
                                } 
                            ]
                        }
                    ]
                }
            });
 
            if(userBond?.status_id !== 3) { //Checking by status to verify if bond 'exists' or not
                return JsonMessages({
                    message: translate.t('error.bond.exists'),
                    res
                });
            }
       
            const createUserBond = await prisma.user.update({
                where: { id: user.id },
                data: { 
                    bond_started_by: {
                        upsert: {
                            where: { id: userBond.id },
                            create: {
                                from_role: {
                                    connect: { id: userRoleId }
                                },
                                to_role: {
                                    connect: { id: toUserRoleId }
                                },
                                to: {
                                    connect: { id: user_to_id }
                                },
                                status: {
                                    connect: { id: 1 }
                                }
                            },
                            update: { status_id: 1 }
                        }
                        
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    telephone: true,
                    birth_day: true
                }
            });

            return JsonMessages({
                statusCode: 201,
                message: translate.t('success.bond.created'),
                data: new BondResource({ data: createUserBond }, req.method),
                _links: StoreBondLinks._links(createUserBond.id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    async update(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
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

            await prisma.bond.findUniqueOrThrow({ //find an toUser - bond
                where: { 
                    id: bond_id,
                    to: { id: user.id }
                }
            });

            const bondStatusId: Bond_Status | null = await prisma.bond_Status.findUniqueOrThrow({ where: { id: status_id } });

            const currentBond: Bond | null = await prisma.bond.findUniqueOrThrow({ where: { id: bond_id } });

            if(currentBond.status_id === 2 || currentBond.status_id === 3 && status_id === 2) {
                return JsonMessages({
                    message: translate.t('error.bond.status.cannotBeChanged'),
                    res
                });
            }

            const updateBondStatus = await prisma.bond.update({
                data: {
                    status: {
                        connect: { id: bondStatusId.id }
                    }
                },
                where: { id: bond_id },
            });

            return JsonMessages({
                message: translate.t('success.bond.updated'),
                data: new BondResource({ data: updateBondStatus }),
                _links: UpdateBondLinks._links(bond_id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    async destroy(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
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

            await prisma.bond.findUniqueOrThrow({ where: { id: bond_id } }); //find an user bond

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
                data: new BondResource({ data: removeBond }),
                _links: DestroyBondLinks._links(),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new BondController();