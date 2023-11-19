import moment from 'moment';

export class BondResource {
    constructor(data: any, reqMethod?: string | undefined) {
        return this.resource(data, reqMethod) as any;
    }
    
    resource(data: any, reqMethod?: string | undefined) {
        if(reqMethod === 'GET') {
            if(data.length !== undefined) {
                const bondData: unknown[] = [];

                data.map((el: any) => {
                    bondData.push({
                        id: el.id,
                        from_user: el.from_user,
                        to: {
                            id: el.to.id,
                            name: el.to.name,
                            email: el.to.email,
                            telephone: el.to.telephone,
                            birth_day: moment(el.to.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY'),
                            account_type: {
                                doctor: el.to.doctor && {
                                    id: el.to.doctor[0].id,
                                    crm: el.to.doctor[0].crm,
                                    crm_state: el.to.doctor[0].crm_state,
                                    crm_verified: el.to.doctor[0].crm_verified,
                                    specialty_id: el.to.doctor[0].specialty_id
                                },
                                carer: el.to.carer && {
                                    id: el.to.carer[0].id,
                                    specialty_id: el.to.carer[0].specialty_id
                                }
                            }
                        },
                        status_id: el.status_id
                    });
                });

                return bondData;   
            }

            return {
                id: data.id,
                from_user: data.from_user,
                to: {
                    id: data.to.id,
                    name: data.to.name,
                    email: data.to.email,
                    telephone: data.to.telephone,
                    birth_day: moment(data.to.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    account_type: {
                        doctor: data.to.doctor && {
                            id: data.to.doctor[0].id,
                            crm: data.to.doctor[0].crm,
                            crm_state: data.to.doctor[0].crm_state,
                            crm_verified: data.to.doctor[0].crm_verified,
                            specialty_id: data.to.doctor[0].specialty_id
                        },
                        carer: data.to.carer && {
                            id: data.to.carer[0].id,
                            specialty_id: data.to.carer[0].specialty_id
                        }
                    }
                },
                status_id: data.status_id
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