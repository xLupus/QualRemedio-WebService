import moment from 'moment';

export class BondResource {
    constructor(data: any) {
        return this.resource(data) as any;
    }

    resource(data: any) {
        return {
            id: data.id,
            name: data.name,
            email: data.email,
            telephone: data.telephone,
            birth_day: moment(data.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY')
        }
    }
}