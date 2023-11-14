import moment from 'moment';

export class BondResource {
    constructor(data: any) {
        return this.resource(data) as any;
    }

    resource(data: any) {
        return {
            id: data.id,
            email: data.email,
            cpf: data.cpf,
            telephone: data.telephone,
            birth_day: moment(data.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY')
        }
    }
}