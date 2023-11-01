import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function role_permission(): Promise<void> {
    const rolePatient: number = 1;
    const roleDoctor: number = 2;
    const roleCarer: number = 3;
    const roleEmployee: number = 4;
    const roleAdmin: number = 5;

    //paciente
    for (let i: number = 13; i <= 16; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: rolePatient,
                permission_id: i
            }
        });
    }

    for (let i: number = 21; i <= 24; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: rolePatient,
                permission_id: i
            }
        });
    }

    for (let i: number = 26; i <= 30; i += 4) {
        await prisma.role_Permission.create({
            data: {
                role_id: rolePatient,
                permission_id: i
            }
        });
    }
    
    for (let i: number = 33; i <= 56; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: rolePatient,
                permission_id: i
            }
        });
    }
    
    for (let i: number = 61; i <= 76; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: rolePatient,
                permission_id: i
            }
        });
    }

    for (let i: number = 81; i <= 88; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: rolePatient,
                permission_id: i
            }
        });
    }

    await prisma.role_Permission.create({
        data: {
            role_id: rolePatient,
            permission_id: 90
        }
    });

    //Doutor
    for (let i: number = 13; i <= 16; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleDoctor,
                permission_id: i
            }
        });
    }

    await prisma.role_Permission.create({
        data: {
            role_id: roleDoctor,
            permission_id: 22
        }
    });

    for (let i: number = 33; i <= 88; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleDoctor,
                permission_id: i
            }
        });
    }

    await prisma.role_Permission.create({
        data: {
            role_id: roleDoctor,
            permission_id: 90
        }
    });

    //Cuidador
    for (let i: number = 13; i <= 16; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleCarer,
                permission_id: i
            }
        });
    }

    for (let i: number = 22; i <= 38; i += 4) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleCarer,
                permission_id: i
            }
        });
    }

    for (let i: number = 41; i <= 44; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleCarer,
                permission_id: i
            }
        });
    }

    await prisma.role_Permission.create({
        data: {
            role_id: roleCarer,
            permission_id: 46
        }
    });
    
    for (let i: number = 61; i <= 76; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleCarer,
                permission_id: i
            }
        });
    }
    
    for (let i: number = 81; i <= 88; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleCarer,
                permission_id: i
            }
        });
    }

    await prisma.role_Permission.create({
        data: {
            role_id: roleCarer,
            permission_id: 90
        }
    });

    //Funcionário
    for (let i: number = 19; i <= 20; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleEmployee,
                permission_id: i
            }
        });
    }

    for (let i: number = 22; i <= 30; i += 4) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleEmployee,
                permission_id: i
            }
        });
    }
    
    for (let i: number = 81; i <= 88; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleEmployee,
                permission_id: i
            }
        });
    }

    await prisma.role_Permission.create({
        data: {
            role_id: roleEmployee,
            permission_id: 90
        }
    });

    //Admin
    for (let i: number = 1; i <= 20; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: 5,
                permission_id: i
            }
        });
    }

    for (let i: number = 22; i <= 30; i += 4) {

        await prisma.role_Permission.create({
            data: {
                role_id: roleAdmin,
                permission_id: i
            }
        });
    }

    for (let i: number = 57; i <= 76; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleAdmin,
                permission_id: i
            }
        });
    }

    for (let i: number = 81; i <= 92; i++) {
        await prisma.role_Permission.create({
            data: {
                role_id: roleAdmin,
                permission_id: i
            }
        });
    }
}