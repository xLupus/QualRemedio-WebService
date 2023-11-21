import { Prisma, PrismaClient, Remider } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { JsonMessages } from '../../../functions/function';
import { i18n } from 'i18next';
import { QueryParamsType, BondPermissionType } from '../../../types/type';
import { ReminderResource } from '../../resources/v1/Reminder/ReminderResource';

import exceptions from '../../../errors/handler';
import BondPermissionRequest from '../../requests/v1/BondPermissionRequest';
import DestroyBondPermissionLinks from '../../resources/v1/hateoas/Bond/BondPermission/DestroyBondPermissionLinks';
import StoreBondPermissionLinks from '../../resources/v1/hateoas/Bond/BondPermission/StoreBondPermissionLinks';
import ShowBondPermissionLinks from '../../resources/v1/hateoas/Bond/BondPermission/ShowBondPermissionLinks';
import IndexBondPermissionLinks from '../../resources/v1/hateoas/Bond/BondPermission/IndexBondPermissionLinks';
import UpdateBondPermissionLinks from '../../resources/v1/hateoas/Bond/BondPermission/UpdateBondPermissionLinks';
import QueryParamsRequest from '../../requests/v1/QueryParamsRequest';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class BondPermissionController {
    //TODO: Documentação
    /**
     * @swagger
     * /user/bond/{bondId}/permissions:
     *    get: 
     *        summary: Show all user reminders
     *        tags: ['Bond Permission']
     *        security: 
     *            - bearerAuth: []
     */
    async index(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { filter, sort, skip, take }: QueryParamsType = QueryParamsRequest.rules(req.query, translate);
        
            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const findManyArgs: Prisma.RemiderFindManyArgs = { where: { user_id: user.id } };
           
            if(filter) {
                const availableFilterFields: string[] = ['label', 'date_time', 'createdAt'];
        
                filter.toString().split(',').map(filterParam => {
                    const [filterColumn, filterValue]: string[] = filterParam.split(':');
            
                    if (availableFilterFields.includes(filterColumn)) {
                        if (filterColumn === 'label') {
                            findManyArgs.where = {
                                ...findManyArgs.where,
                                label: {
                                    contains: filterValue
                                }
                            }
                        }

                        //TODO: rever

                      /*   if (filterColumn === 'date_time') {
                            findManyArgs.where = {
                                ...findManyArgs.where,
                                date_time: {}
                            }
                        }

                        if (filterColumn === 'createdAt') {
                            findManyArgs.where = {
                                ...findManyArgs.where,
                                createdAt: filterValue
                            }
                        } */
                    }
                })
            }
        
            if(sort) {
                const availableSortFields: string[] = ['id', 'label', 'date_time', 'createdAt'];
                const sortParam: string = sort.toString();
                const param: string = sortParam.slice(1);
        
                if (availableSortFields.includes(param)) {
                    const orderOperator: 'desc' | 'asc' = sortParam[0] === '-' ? 'desc' : 'asc';
            
                    if (param === 'id') findManyArgs.orderBy = { id: orderOperator };

                    if (param === 'label') findManyArgs.orderBy = { label: orderOperator };

                    //TODO: rever
                    /* if (param === 'date_time') findManyArgs.orderBy = { date_time: orderOperator };

                    if (param === 'createdAt') findManyArgs.orderBy = { createdAt: orderOperator }; */
                }
            }

            if(take || skip) {              
                findManyArgs.take = take;
                findManyArgs.skip = skip;
            }

            const reminders: Remider[] | null = await prisma.remider.findMany(findManyArgs);

            if(reminders.length === 0) {
                return JsonMessages({
                    message: translate.t('error.reminder.notFound'),
                    res
                });
            }

            return JsonMessages({
                message: translate.t('success.reminder.returned'),
                data: new ReminderResource({ data: reminders }, req.method),
                _links: IndexBondPermissionLinks._links(),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /user/bond/{bondId}/permissions/{permissionId}:
     *    get: 
     *        summary: Show one user reminder
     *        tags: ['Bond Permission']
     *        security: 
     *            - bearerAuth: []
     */
    async show(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { reminder_id }: BondPermissionType = BondPermissionRequest.rules({ reminder_id: Number(req.params.id) }, translate, req.method);

            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const reminder: Remider | null = await prisma.remider.findUnique({
                where: { 
                    id: reminder_id,
                    user_id: user.id
                }
            });

            if(!reminder) {
                return JsonMessages({
                    message: translate.t('error.reminder.notFound'),
                    res
                });
            }

            return JsonMessages({
                message: translate.t('success.reminder.returned'),
                data: new ReminderResource({ data: reminder }, req.method),
                _links: ShowBondPermissionLinks._links(reminder_id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /user/bond/{bondId}/permissions/{permissionId}:
     *    post: 
     *        summary: Create one user reminder
     *        tags: ['Bond Permission']
     *        security: 
     *            - bearerAuth: []
     */
    async store(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { label, date_time }: BondPermissionType = BondPermissionRequest.rules(req.body, translate, req.method);
            
            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const findReminder = await prisma.remider.findFirst({ where: { label, date_time } });

            if(findReminder) {
                return JsonMessages({
                    message: translate.t('error.reminder.exists'),
                    res
                });
            }

            const createReminder = await prisma.remider.create({
                data: { 
                    label: label ? label : '', 
                    date_time: date_time ? date_time : '',
                    user: {
                        connect: { id: user.id }
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            birth_day: true,
                            telephone: true
                        }
                    }
                }
            });
        
            return JsonMessages({
                statusCode: 201,
                message: translate.t('success.reminder.created'),
                data: new ReminderResource({ data: createReminder }, req.method),
                _links: StoreBondPermissionLinks._links(createReminder.id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /user/bond/{bondId}/permissions/{reminderId}:
     *    patch: 
     *        summary: Update one user reminder
     *        tags: ['Bond Permission']
     *        security: 
     *            - bearerAuth: []
     */
    async update(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { label, date_time, reminder_id }: BondPermissionType = BondPermissionRequest.rules({
                label: req.body.label,
                date_time: req.body.date_time,
                reminder_id: Number(req.params.id)
            }, translate, req.method);

            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const reminder: Remider | null = await prisma.remider.findUnique({
                where: { 
                    id: reminder_id,
                    user_id: user.id
                }
            });

            if(!reminder) {
                return JsonMessages({
                    message: translate.t('error.reminder.notFound'),
                    res
                });
            }

            const updateReminder = await prisma.remider.update({
                where: { id: reminder_id },
                data: {
                    label,
                    date_time
                }
            });

            return JsonMessages({
                message: translate.t('success.reminder.updated'),
                data: new ReminderResource({ data: updateReminder }),
                _links: UpdateBondPermissionLinks._links(reminder_id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /user/bond/{bondId}/permissions/{reminderId}:
     *    delete: 
     *        summary: Remove on user reminder
     *        tags: ['Bond Permission']
     *        security: 
     *            - bearerAuth: []
     */
    async destroy(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { reminder_id }: BondPermissionType = BondPermissionRequest.rules({ reminder_id: Number(req.params.id) }, translate, req.method);

            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const reminder: Remider | null = await prisma.remider.findUnique({
                where: { 
                    id: reminder_id,
                    user_id: user.id
                }
            });

            if(!reminder) {
                return JsonMessages({
                    message: translate.t('error.reminder.notFound'),
                    res
                });
            }

            const removerReminder = await prisma.remider.delete({ where: { id: reminder_id }});

            return JsonMessages({
                message: translate.t('success.reminder.deleted'),
                data: new ReminderResource({ data: removerReminder }, req.method),
                _links: DestroyBondPermissionLinks._links(),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new BondPermissionController();