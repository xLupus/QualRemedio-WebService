import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";

const prisma = new PrismaClient();

export async function users(): Promise<void> {
    const passwordHash: string = await bcrypt.hash('12345678', 15);
    const date: string = new Date().toISOString();

    const roleAdmin: number = 5;
    const rolePatitent: number = 1;

    await prisma.$transaction([
        prisma.user.create({
            data: {
                name: "Mr.Raf",
                email: "mrraf@admin.com",
                password: passwordHash,
                cpf: "12345678901",
                birth_day: date,
                telephone: "12345678900",
                role: {
                    connect: {
                        id: roleAdmin
                    }
                }
            }
        }),
        prisma.user.create({
            data: {
                name: "Lupus",
                email: "lupus@admin.com",
                password: passwordHash,
                cpf: "12345678903",
                birth_day: date,
                telephone: "12345678902",
                role: {
                    connect: {
                        id: roleAdmin
                    }
                }
            }
        }),
        prisma.user.create({
            data: {
                name: "Test",
                email: "test@test.com",
                password: passwordHash,
                cpf: "12345678904",
                birth_day: date,
                telephone: "12345678905",
                role: {
                    connect: {
                        id: rolePatitent
                    }
                }
            }
        })
    ]);
}