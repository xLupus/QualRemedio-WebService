import { Notification, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { JsonMessages } from '../../../functions/function';
import { i18n } from 'i18next';
import { QueryParamsType, NotificationType } from '../../../types/type';
import { NotificationResource } from '../../resources/v1/Notification/NotificationResource';

import exceptions from '../../../errors/handler';
import NotificationRequest from '../../requests/v1/NotificationRequest';
import DestroyNotificationLinks from '../../resources/v1/hateoas/Notification/DestroyNotificationLinks';
import StoreNotificationLinks from '../../resources/v1/hateoas/Notification/StoreNotificationLinks';
import ShowNotificationLinks from '../../resources/v1/hateoas/Notification/ShowNotificationLinks';
import IndexNotificationLinks from '../../resources/v1/hateoas/Notification/IndexNotificationLinks';
import UpdateNotificationLinks from '../../resources/v1/hateoas/Notification/UpdateNotificationLinks';
import QueryParamsRequest from '../../requests/v1/QueryParamsRequest';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class NotificationController {
    //TODO: Documentação
    /**
     * @swagger
     * /users/notifications:
     *    get: 
     *        summary: Show all user notifications
     *        tags: ['Notification']
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

            const findManyArgs: Prisma.NotificationFindManyArgs = { where: { user_id: user.id } };
           
            if(filter) {
                const availableFilterFields: string[] = ['title', 'read'];
        
                filter.toString().split(',').map(filterParam => {
                    const [filterColumn, filterValue]: string[] = filterParam.split(':');

                    if (availableFilterFields.includes(filterColumn)) {
                        if (filterColumn === 'title') {
                            findManyArgs.where = {
                                ...findManyArgs.where,
                                title: {
                                    contains: filterValue
                                }
                            }
                        }

                        if (filterColumn === 'read') {
                            findManyArgs.where = {
                                ...findManyArgs.where,
                                read: !!Number(filterValue) //TODO: Rever
                            }
                        }
                    }
                })
            }
        
            if(sort) {
                const availableSortFields: string[] = ['id', 'title', 'read'];
                const sortParam: string = sort.toString();;            
                const param: string = sortParam[0] === '-' ? sortParam.slice(1) : sortParam.slice(0);
                
                if (availableSortFields.includes(param)) {
                    const orderOperator: 'desc' | 'asc' = sortParam[0] === '-' ? 'desc' : 'asc';
            
                    if (param === 'id') findManyArgs.orderBy = { id: orderOperator };

                    if (param === 'title') findManyArgs.orderBy = { title: orderOperator };

                    if (param === 'read') findManyArgs.orderBy = { read: orderOperator };
                }
            }

            if(take || skip) {              
                findManyArgs.take = take;
                findManyArgs.skip = skip;
            }

            const notifications: Notification[] | null = await prisma.notification.findMany(findManyArgs);

            if(notifications.length === 0) {
                return JsonMessages({
                    message: translate.t('error.notification.notFound'),
                    res
                });
            }

            return JsonMessages({
                message: translate.t('success.notification.returned'),
                data: new NotificationResource({ data: notifications }, req.method),
                _links: IndexNotificationLinks._links(),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /users/notifications:
     *    get: 
     *        summary: Show one user notification
     *        tags: ['Notification']
     *        security: 
     *            - bearerAuth: []
     */
    async show(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { notification_id }: NotificationType = NotificationRequest.rules({ notification_id: Number(req.params.id) }, translate, req.method);

            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const notification: Notification | null = await prisma.notification.findUniqueOrThrow({
                where: { 
                    id: notification_id,
                    user_id: user.id
                }
            });

            return JsonMessages({
                message: translate.t('success.notification.returned'),
                data: new NotificationResource({ data: notification }, req.method),
                _links: ShowNotificationLinks._links(notification_id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /users/notifications/{notificationId}:
     *    post: 
     *        summary: Create one user notification
     *        tags: ['Notification']
     *        security: 
     *            - bearerAuth: []
     */
    async store(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { title, message }: NotificationType = NotificationRequest.rules(req.body, translate, req.method);
            
            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const notification: Notification | null = await prisma.notification.findFirst({ where: { title, message } });

            if(notification) {
                return JsonMessages({
                    message: translate.t('error.notification.exists'),
                    res
                });
            }

            const createNotification = await prisma.notification.create({
                data: { 
                    title: title ? title : '', 
                    message: message ? message : '',
                    user: {
                        connect: { id: user.id }
                    }
                }
            });
        
            return JsonMessages({
                statusCode: 201,
                message: translate.t('success.notification.created'),
                data: new NotificationResource({ data: createNotification }, req.method),
                _links: StoreNotificationLinks._links(createNotification.id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /users/notifications/{notificationId}:
     *    patch: 
     *        summary: Update one user notification
     *        tags: ['Notification']
     *        security: 
     *            - bearerAuth: []
     */
    async update(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { title, message, read, notification_id }: NotificationType = NotificationRequest.rules({
                title: req.body.title,
                message: req.body.message,
                read: req.body.read,
                notification_id: Number(req.params.id)
            }, translate, req.method);

            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const notification: Notification | null = await prisma.notification.findUnique({
                where: { 
                    id: notification_id,
                    user_id: user.id
                }
            });

            if(!notification) {
                return JsonMessages({
                    message: translate.t('error.notification.notFound'),
                    res
                });
            } else if(notification.read === true) {
                return JsonMessages({
                    message: translate.t('error.notification.cannotBeChanged'),
                    res
                });
            }

            const updateNotification = await prisma.notification.update({
                where: { id: notification_id },
                data: {
                    title,
                    message,
                    read
                }
            });

            return JsonMessages({
                message: translate.t('success.notification.updated'),
                data: new NotificationResource({ data: updateNotification }),
                _links: UpdateNotificationLinks._links(notification_id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

    /**
     * @swagger
     * /users/notifications/{notificationId}:
     *    delete: 
     *        summary: Remove on user notification
     *        tags: ['Notification']
     *        security: 
     *            - bearerAuth: []
     */
    async destroy(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { notification_id }: NotificationType = NotificationRequest.rules({ notification_id: Number(req.params.id) }, translate, req.method);

            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            await prisma.notification.findUniqueOrThrow({
                where: { 
                    id: notification_id,
                    user_id: user.id
                }
            });

            const removerNotification = await prisma.notification.delete({ where: { id: notification_id }});

            return JsonMessages({
                message: translate.t('success.notification.deleted'),
                data: new NotificationResource({ data: removerNotification }, req.method),
                _links: DestroyNotificationLinks._links(),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new NotificationController();