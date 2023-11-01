import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function specialty(): Promise<void> {
    await prisma.medical_Specialty.createMany({
        data: [
            {
                name: "Odontologia"
            },
            {
                name: "Otorrinolaringologia"
            },
            {
                name: "Cirurgião Plástico"
            }
        ]
    });
}
