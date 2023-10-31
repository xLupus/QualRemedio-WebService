import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function roles(): Promise<void> {
    await prisma.role.createMany({
        data: [
            {
                name: "Patient",
                description: "Concede permissão para o cargo de paciente",
            },
            {
                name: "Doctor",
                description: "Concede permissão para o cargo de doutor",
            },
            {
                name: "Carer",
                description: "Concede permissão para o cargo de cuidador",
            },
            {
                name: "Employee",
                description: "Concede permissão para o cargo de funcionário",
            },
            {
                name: "Admin",
                description: "Concede permissão para o cargo de administrador",
            }
        ]
    });
}
