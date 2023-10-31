import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function permissions(): Promise<void> {
    await prisma.permission.createMany({
        data: [
            {
                name: "Create.permission",
                description: "Permissão para criar novas permissões no sistema.",
            },
            {
                name: "Read.permission",
                description: "Permissão para visualizar permissões existentes.",
            },
            {
                name: "Edit.permission",
                description: "Permissão para modificar permissões existentes.",
            },
            {
                name: "Delete.permission",
                description: "Permissão para remover permissões do sistema.",
            },
            {
                name: "Create.role",
                description: "Permissão para criar novas funções de usuário.",
            },
            {
                name: "Read.role",
                description: "Permissão para visualizar funções de usuário existentes.",
            },
            {
                name: "Edit.role",
                description: "Permissão para modificar funções de usuário existentes.",
            },
            {
                name: "Delete.role",
                description: "Permissão para remover funções de usuário do sistema.",
            },
            {
                name: "Create.role-permission",
                description: "Permissão para associar permissões a funções de usuário.",
            },
            {
                name: "Read.role-permission",
                description:
                "Permissão para visualizar as associações entre funções e permissões.",
            },
            {
                name: "Edit.role-permission",
                description:
                "Permissão para modificar as associações entre funções e permissões.",
            },
            {
                name: "Delete.role-permission",
                description:
                "Permissão para remover as associações entre funções e permissões.",
            },
            {
                name: "Create.user",
                description: "Permissão para criar novas contas de usuário.",
            },
            {
                name: "Read.user",
                description:
                "Permissão para visualizar informações sobre contas de usuário.",
            },
            {
                name: "Edit.user",
                description: "Permissão para modificar detalhes das contas de usuário.",
            },
            {
                name: "Delete.user",
                description: "Permissão para remover contas de usuário.",
            },
            {
                name: "Create.employer",
                description:
                "Permissão para criar e gerenciar informações de empregadores.",
            },
            {
                name: "Read.employer",
                description: "Permissão para visualizar informações de empregadores.",
            },
            {
                name: "Edit.employer",
                description: "Permissão para modificar detalhes de empregadores.",
            },
            {
                name: "Delete.employer",
                description: "Permissão para remover informações de empregadores.",
            },
            {
                name: "Create.patient",
                description: "Permissão para criar registros de pacientes.",
            },
            {
                name: "Read.patient",
                description: "Permissão para visualizar informações de pacientes.",
            },
            {
                name: "Edit.patient",
                description: "Permissão para modificar detalhes de pacientes.",
            },
            {
                name: "Delete.patient",
                description: "Permissão para remover registros de pacientes.",
            },
            {
                name: "Create.doctor",
                description: "Permissão para criar registros de médicos.",
            },
            {
                name: "Read.doctor",
                description: "Permissão para visualizar informações de médicos.",
            },
            {
                name: "Edit.doctor",
                description: "Permissão para modificar detalhes de médicos.",
            },
            {
                name: "Delete.doctor",
                description: "Permissão para remover registros de médicos.",
            },
            {
                name: "Create.carer",
                description: "Permissão para criar registros de cuidadores.",
            },
            {
                name: "Read.carer",
                description: "Permissão para visualizar informações de cuidadores.",
            },
            {
                name: "Edit.carer",
                description: "Permissão para modificar detalhes de cuidadores.",
            },
            {
                name: "Delete.carer",
                description: "Permissão para remover registros de cuidadores.",
            },
            {
                name: "Create.consultation",
                description: "Permissão para criar registros de consultas.",
            },
            {
                name: "Read.consultation",
                description: "Permissão para visualizar informações de consultas.",
            },
            {
                name: "Edit.consultation",
                description: "Permissão para modificar detalhes de consultas.",
            },
            {
                name: "Delete.consultation",
                description: "Permissão para remover registros de consultas.",
            },
            {
                name: "Create.prescription",
                description: "Permissão para criar registros de prescrições médicas.",
            },
            {
                name: "Read.prescription",
                description: "Permissão para visualizar informações de prescrições.",
            },
            {
                name: "Edit.prescription",
                description: "Permissão para modificar detalhes de prescrições.",
            },
            {
                name: "Delete.prescription",
                description: "Permissão para remover registros de prescrições.",
            },
            {
                name: "Create.patient-bond",
                description:
                "Permissão para criar registros associando pacientes a vínculos.",
            },
            {
                name: "Read.patient-bond",
                description:
                "Permissão para visualizar as associações entre pacientes e vínculos.",
            },
            {
                name: "Edit.patient-bond",
                description:
                "Permissão para modificar as associações entre pacientes e vínculos.",
            },
            {
                name: "Delete.patient-bond",
                description:
                "Permissão para remover as associações entre pacientes e vínculos.",
            },
            {
                name: "Create.patient-consultation",
                description:
                "Permissão para criar registros associando pacientes a consultas.",
            },
            {
                name: "Read.patient-consultation",
                description:
                "Permissão para visualizar as associações entre pacientes e consultas.",
            },
            {
                name: "Edit.patient-consultation",
                description:
                "Permissão para modificar as associações entre pacientes e consultas.",
            },
            {
                name: "Delete.patient-consultation",
                description:
                "Permissão para remover as associações entre pacientes e consultas.",
            },
            {
                name: "Create.patient-prescription",
                description:
                "Permissão para criar registros associando pacientes a prescrições médicas.",
            },
            {
                name: "Read.patient-prescription",
                description:
                "Permissão para visualizar as associações entre pacientes e prescrições",
            },
            {
                name: "Edit.patient-prescription",
                description:
                "Permissão para modificar as associações entre pacientes e prescrições.",
            },
            {
                name: "Delete.patient-prescription",
                description:
                "Permissão para remover as associações entre pacientes e prescrições.",
            },
            {
                name: "Create.patient-reminder",
                description:
                "Permissão para criar registros associando pacientes a lembretes.",
            },
            {
                name: "Read.patient-reminder",
                description:
                "Permissão para visualizar as associações entre pacientes e lembretes.",
            },
            {
                name: "Edit.patient-reminder",
                description:
                "Permissão para modificar as associações entre pacientes e lembretes.",
            },
            {
                name: "Delete.patient-reminder",
                description:
                "Permissão para remover as associações entre pacientes e lembretes.",
            },
            {
                name: "Create.notification",
                description: "Permissão para criar notificações do sistema.",
            },
            {
                name: "Read.notification",
                description: "Permissão para visualizar notificações do sistema.",
            },
            {
                name: "Edit.notification",
                description:
                "Permissão para modificar informações sobre notificações no sistema.",
            },
            {
                name: "Delete.notification",
                description: "Permissão para remover notificações do sistema.",
            },
            {
                name: "Create.reminder",
                description: "Permissão para criar lembretes.",
            },
            {
                name: "Read.reminder",
                description: "Permissão para visualizar lembretes no sistema.",
            },
            {
                name: "Edit.reminder",
                description: "Permissão para modificar informações sobre lembretes.",
            },
            {
                name: "Delete.reminder",
                description: "Permissão para remover lembretes do sistema.",
            },
            {
                name: "Create.bond",
                description:
                "Permissão para criar vínculos, que podem representar relacionamentos entre pacientes e cuidadores.",
            },
            {
                name: "Read.bond",
                description: "Permissão para visualizar informações sobre vínculos.",
            },
            {
                name: "Edit.bond",
                description: "Permissão para modificar detalhes dos vínculos.",
            },
            {
                name: "Delete.bond",
                description: "Permissão para desfazer vínculos.",
            },
            {
                name: "Create.bond-status",
                description:
                "Permissão para criar informações de status relacionadas a vínculos.",
            },
            {
                name: "Read.bond-status",
                description:
                "Permissão para visualizar informações de status de vínculos.",
            },
            {
                name: "Edit.bond-status",
                description: "Permissão para modificar detalhes do status de vínculos.",
            },
            {
                name: "Delete.bond-status",
                description:
                "Permissão para remover informações de status de vínculos.",
            },
            {
                name: "Create.bond-permission",
                description: "Permissão para criar novos vínculos no sistema.",
            },
            {
                name: "Read.bond-permission",
                description: "Permissão para ver detalhes dos vínculos.",
            },
            {
                name: "Edit.bond-permission",
                description: "Permissão para editar vínculos.",
            },
            {
                name: "Delete.bond-permission",
                description: "Permissão remover vínculos",
            },
            {
                name: "Create.consultation-status",
                description:
                "Permissão para criar informações de status relacionadas a consultas.",
            },
            {
                name: "Read.consultation-status",
                description:
                "Permissão para visualizar informações de status de consultas.",
            },
            {
                name: "Edit.consultation-status",
                description:
                "Permissão para modificar detalhes do status de consultas.",
            },
            {
                name: "Delete.consultation-status",
                description:
                "Permissão para remover informações de status de consultas",
            },
            {
                name: "Create.password",
                description: "Permissão para criar senhas de usuário.",
            },
            {
                name: "Read.password",
                description:
                "Permissão para visualizar senhas de usuário (geralmente para fins administrativos).",
            },
            {
                name: "Edit.password",
                description: "Permissão para alterar senhas de usuário.",
            },
            {
                name: "Delete.password",
                description: " Permissão para remover senhas de usuário.",
            },
            {
                name: "Create.picture",
                description: "Permissão para fazer upload e criar imagens.",
            },
            {
                name: "Read.picture",
                description: "Permissão para visualizar imagens.",
            },
            {
                name: "Edit.picture",
                description: "Permissão para modificar detalhes de imagens.",
            },
            {
                name: "Delete.picture",
                description: "Permissão para remover imagens.",
            },
            {
                name: "Create.medical-department",
                description: "Permissão para criar departamentos médicos ou unidades.",
            },
            {
                name: "Read.medical-department",
                description:
                "Permissão para visualizar informações sobre departamentos médicos.",
            },
            {
                name: "Edit.medical-department",
                description:
                "Permissão para modificar detalhes do departamento médico.",
            },
            {
                name: "Delete.medical-department",
                description: "Permissão para remover departamentos médicos.",
            },
        ]
    });
}