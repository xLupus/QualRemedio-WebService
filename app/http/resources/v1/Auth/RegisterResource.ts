import moment from 'moment';

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
            birth_day: moment(data.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY'),
            is_verified: data.is_verified,
            account_type: {
                patient: (data.doctor.length === 0 && data.carer.length === 0) && true,
                doctor: data.doctor.length !== 0 && true,
                carer: data.carer.length !== 0 && true
            }
        }
    }
}