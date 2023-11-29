import { Prisma, PrismaClient, Bond_Permission } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { JsonMessages } from '../../../functions/function';
import { i18n } from 'i18next';
import { BondPermissionType } from '../../../types/type';
import { BondPermissionResource } from '../../resources/v1/Bond/BondPermissionResource';

import exceptions from '../../../errors/handler';
import BondPermissionRequest from '../../requests/v1/BondPermissionRequest';
import DestroyBondPermissionLinks from '../../resources/v1/hateoas/Bond/BondPermission/DestroyBondPermissionLinks';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class BondPermissionController {
    //TODO: Documentação
    /**
     * @swagger
     * /users/bonds/{bondId}/permissions/{permissionId}/bond-permissions:
     *    post: 
     *        summary: Create one user permission based on bond
     *        tags: ['Bond Permission']
     *        security: 
     *            - bearerAuth: []
     */
    async store(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { permission_id, bond_id }: BondPermissionType = BondPermissionRequest.rules({ bond_id: Number(req.params.bondId), permission_id: Number(req.params.permissionId) }, translate);
            
            const user = req.user as any;

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            await prisma.permission.findUniqueOrThrow({ where: { id: permission_id }});

            await prisma.bond.findUniqueOrThrow({ 
                where: { 
                    id: permission_id,
                    OR: [
                        {
                            from: { id: user.id }
                        },
                        {
                            to: { id: user.id }
                        }
                    ]
                }
            });

            const createBondPermission = await prisma.bond_Permission.create({
                data: {
                    permission_id,
                    bond_id
                },
                select: {
                    id: true,
                    permission_id: true,
                    bond_id: true
                }
            });
            
            return JsonMessages({
                statusCode: 201,
                message: translate.t('success.bondPermission.created'),
                data: new BondPermissionResource({ data: createBondPermission }),
                //_links: StoreBondPermissionLinks._links(createReminder.id),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new BondPermissionController();