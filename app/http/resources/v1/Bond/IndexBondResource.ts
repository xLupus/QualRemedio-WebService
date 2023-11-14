import moment from 'moment';

export class IndexBondResource {
    constructor(data: any) {
        return this.resource(data) as any;
    }
    
    resource(data: any) {
        return {
            id: data.id,
            from_user: data.from_user,
            to_user: data.to_user,
            status_id: data.status_id,
            to: {
                id: data.id,
                email: data.email,
                cpf: data.cpf,
                telephone: data.telephone,
                birth_day: moment(data.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY')
            }
        }
       
    }
}