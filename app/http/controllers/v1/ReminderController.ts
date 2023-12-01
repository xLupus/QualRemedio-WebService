import { Prisma, PrismaClient, Reminder } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { JsonMessages } from '../../../functions/function';
import { i18n } from 'i18next';
import { QueryParamsType, ReminderType } from '../../../types/type';
import { ReminderResource } from '../../resources/v1/Reminder/ReminderResource';

import exceptions from '../../../errors/handler';
import ReminderRequest from '../../requests/v1/ReminderRequest';
import DestroyReminderLinks from '../../resources/v1/hateoas/Reminder/DestroyReminderLinks';
import StoreReminderLinks from '../../resources/v1/hateoas/Reminder/StoreReminderLinks';
import ShowReminderLinks from '../../resources/v1/hateoas/Reminder/ShowReminderLinks';
import IndexReminderLinks from '../../resources/v1/hateoas/Reminder/IndexReminderLinks';
import UpdateReminderLinks from '../../resources/v1/hateoas/Reminder/UpdateReminderLinks';
import QueryParamsRequest from '../../requests/v1/QueryParamsRequest';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class ReminderController {
    //TODO: Documentação
    /**
     * @swagger
     * /user/reminder:
     *    get: 
     *        summary: Show all user reminders
     *        tags: ['Reminder']
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

            const findManyArgs: Prisma.ReminderFindManyArgs = { where: { user_id: user.id } };
           
            if(filter) {
                const availableFilterFields: string[] = ['label'];
        
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
                    }
                })
            }
        
            if(sort) {
                const availableSortFields: string[] = ['id', 'label'];
                const sortParam: string = sort.toString();
                const param: string = sortParam[0] === '-' ? sortParam.slice(1) : sortParam.slice(0);
        
                if (availableSortFields.includes(param)) {
                    const orderOperator: 'desc' | 'asc' = sortParam[0] === '-' ? 'desc' : 'asc';
            
                    if (param === 'id') findManyArgs.orderBy = { id: orderOperator };

                    if (param === 'label') findManyArgs.orderBy = { label: orderOperator };
                }
            }

            if(take || skip) {              
                findManyArgs.take = take;
                findManyArgs.skip = skip;
            }

            const reminders: Reminder[] | null = await prisma.reminder.findMany(findManyArgs);

            if(reminders.length === 0) {
                return JsonMessages({
                    message: translate.t('error.reminder.notFound'),
                    res
                });
            }

            return JsonMessages({
                message: translate.t('success.reminder.returned'),
                data: new ReminderResource({ data: reminders }, req.method),
                _links: IndexReminderLinks._links(),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /user/reminder:
     *    get: 
     *        summary: Show one user reminder
     *        tags: ['Reminder']
     *        security: 
     *            - bearerAuth: []
     */
    
    async show(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { reminder_id }: ReminderType = ReminderRequest.rules({ reminder_id: Number(req.params.id) }, translate, req.method);

            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const reminder: Reminder | null = await prisma.reminder.findUnique({
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
                _links: ShowReminderLinks._links(reminder_id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /user/reminder/{reminderId}:
     *    post: 
     *        summary: Create one user reminder
     *        tags: ['Reminder']
     *        security: 
     *            - bearerAuth: []
     */
    async store(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { label, date_time }: ReminderType = ReminderRequest.rules(req.body, translate, req.method);
            
            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const findReminder = await prisma.reminder.findFirst({ where: { label, date_time } });

            if(findReminder) {
                return JsonMessages({
                    message: translate.t('error.reminder.exists'),
                    res
                });
            }

            const createReminder = await prisma.reminder.create({
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
                _links: StoreReminderLinks._links(createReminder.id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /user/bond/{reminderId}:
     *    patch: 
     *        summary: Update one user reminder
     *        tags: ['Reminder']
     *        security: 
     *            - bearerAuth: []
     */
    async update(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { label, date_time, reminder_id }: ReminderType = ReminderRequest.rules({
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

            const reminder: Reminder | null = await prisma.reminder.findUnique({
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

            const updateReminder = await prisma.reminder.update({
                where: { id: reminder_id },
                data: {
                    label,
                    date_time
                }
            });

            return JsonMessages({
                message: translate.t('success.reminder.updated'),
                data: new ReminderResource({ data: updateReminder }),
                _links: UpdateReminderLinks._links(reminder_id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /user/bond/{reminderId}:
     *    delete: 
     *        summary: Remove on user reminder
     *        tags: ['Reminder']
     *        security: 
     *            - bearerAuth: []
     */
    async destroy(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { reminder_id }: ReminderType = ReminderRequest.rules({ reminder_id: Number(req.params.id) }, translate, req.method);

            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const reminder: Reminder | null = await prisma.reminder.findUnique({
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

            const removerReminder = await prisma.reminder.delete({ where: { id: reminder_id }});

            return JsonMessages({
                message: translate.t('success.reminder.deleted'),
                data: new ReminderResource({ data: removerReminder }, req.method),
                _links: DestroyReminderLinks._links(),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new ReminderController();