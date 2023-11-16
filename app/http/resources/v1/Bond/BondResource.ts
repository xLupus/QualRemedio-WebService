import moment from 'moment';

export class BondResource {
    constructor(data: any, reqMethod?: string | undefined) {
        return this.resource(data, reqMethod) as any;
    }
    
    resource(data: any, reqMethod?: string | undefined) {
        if(reqMethod === 'GET' && data.length !== undefined) {
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
        } else if(reqMethod === 'GET') {
            return {
                id: data.id,
                name: data.name,
                email: data.email,
                telephone: data.telephone,
                birth_day: moment(data.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY')
            }    
        } else if(reqMethod === 'POST') {
            return {
                id: data.id,
                name: data.name,
                email: data.email,
                telephone: data.telephone,
                birth_day: moment(data.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY')
            }
        }

        return {
            id: data.id,
            from_user: data.from_user,
            to_user: data.to_user,
            status_id: data.status_id
        }
    }
}