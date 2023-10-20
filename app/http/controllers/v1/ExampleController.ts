//import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

//const prisma = new PrismaClient();

class ExampleController {
    async index(req: Request, res: Response) {
        return res.status(200).json({
            test: 'HELLO WORLD!'
        });
    }

    async show(req: Request, res: Response) {
        return;
    }

    async store(req: Request, res: Response) {
        return;
    }

    async update(req: Request, res: Response) {
        return;
    }

    async destroy(req: Request, res: Response) {
        return;
    }
}

export default new ExampleController();