import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function status(): Promise<void> {
    //Consultation status
    await prisma.consultation_Status.createMany({
        data: [
            {
                status: "Agendada"
            },
            {
                status: "Realizada"
            },
            {
                status: "Cancelada"
            }  
        ]
    });

    //Bond status
    await prisma.bond_Status.createMany({
        data: [
            {
                status: "Pendente"
            },
            {
                status: "Aceito"
            },
            {
                status: "Recusado"
            }  
        ]
    });
}