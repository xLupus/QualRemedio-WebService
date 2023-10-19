/*
import passport from 'passport';
import exceptions from '../../errors/handler';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PrismaClient, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../../functions/function';
import 'dotenv/config';

const prisma = new PrismaClient();
const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY || 'secret',
};

passport.use(new Strategy(options, async function(payload, done): Promise<void> {
    try {
        const user: User | null = await prisma.user.findUnique({ where: { id: payload.id }});

        return !user ? done(null, false) : done(null, user);
    } catch (error: unknown) {
        return done(error, false);
    }
}));
*/
/**
 * User authenticates requests
 * @param {Request} req Application request
 * @param {Response} res Application response
 * @param {NextFunction} next Function to go to the next middleware
 */
/*
export const passportJWT = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('jwt', { session: false }, async (err: unknown | null, user: User, authErr: any) => {
        if(err || authErr) return exceptions(err || authErr, res);

        if(await verifyToken(req.headers.authorization!.split(' ')[1])) return exceptions(false, res);
    
        req.user = user;
        next();
    })(req, res, next);
}
*/