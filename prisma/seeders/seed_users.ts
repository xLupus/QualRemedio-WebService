import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";
const prisma = new PrismaClient();

export async function users(): Promise<void> {
    const passwordHash = await bcrypt.hash('12345678', 15);
    const date = new Date().toISOString();

    await prisma.user.createMany({
        data: [
            {
                name: "Mr.Raf",
                email: "mrraf@gmail.com",
                password: passwordHash,
                cpf: "12345678901",
                birth_day: date,
                telephone: "12345678900",
                role_id: 5
            },
            {
                name: "Lupus",
                email: "lupus@gmail.com",
                password: passwordHash,
                cpf: "12345678903",
                birth_day: date,
                telephone: "12345678902",
                role_id: 5
            }
        ]
    });
}
