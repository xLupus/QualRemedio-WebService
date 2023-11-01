import { PrismaClient } from '@prisma/client';
import { roles } from './seeders/seed_roles';
import { permissions } from './seeders/seed_permissions';
import { role_permission } from './seeders/seed_role_permission';
import { users } from './seeders/seed_users';
import { specialty } from './seeders/seed_specialty';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    await roles();
    await permissions();
    await role_permission();
    await users();
    await specialty();
}

main()
    .then(async () => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})