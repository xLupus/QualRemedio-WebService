export class RegisterResource {
    constructor(data: any) {
        return this.resource(data) as any;
    }

    resource(data: any) {
        return {
            id: data.id,
            email: data.email,
            cpf: data.cpf,
            telephone: data.telephone,
            birth_day: data.birth_day,
            account_type: {
                patient: (data.doctor.length === 0 && data.carer.length === 0) && true,
                doctor: data.doctor.length !== 0 && true,
                carer: data.carer.length !== 0 && true
            }
        }
    }
}