import moment from 'moment';

export class BondResource {
    constructor(data: any, reqMethod?: string | undefined) {
        return this.resource(data, reqMethod) as any;
    }
    
    resource({ data, userId }: { data: any, userId?: number | undefined}, reqMethod?: string | undefined) {
        if(reqMethod === 'GET') {
            if(data.length !== undefined) {
                const bondData: unknown[] = [];

                data.map((el: any) => {
                    bondData.push({
                        id: el.id,
                        from_user: el.from_user,
                        from: el.from.id !== userId ? {
                            id: el.from.id,
                            name: el.from.name,
                            email: el.from.email,
                            telephone: el.from.telephone,
                            birth_day: moment(el.from.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY'),
                            account_type: {
                                patient: (el.from_user_role === 1) && true,
                                doctor: (el.from_user_role === 2) && {
                                    id: el.from.doctor[0].id,
                                    crm: el.from.doctor[0].crm,
                                    crm_state: el.from.doctor[0].crm_state,
                                    crm_verified: el.from.doctor[0].crm_verified,
                                    specialty_id: el.from.doctor[0].specialty_id
                                },
                                carer: (el.from_user_role === 3) && {
                                    id: el.from.carer[0].id,
                                    specialty_id: el.from.carer[0].specialty_id
                                }
                            }
                        } : {},
                        to_user: el.to_user,
                        to: el.to.id !== userId ? {
                            id: el.to.id,
                            name: el.to.name,
                            email: el.to.email,
                            telephone: el.to.telephone,
                            birth_day: moment(el.to.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY'),
                            account_type: {
                                patient: (el.to_user_role === 1) && true,
                                doctor: (el.to_user_role === 2) && {
                                    id: el.to.doctor[0].id,
                                    crm: el.to.doctor[0].crm,
                                    crm_state: el.to.doctor[0].crm_state,
                                    crm_verified: el.to.doctor[0].crm_verified,
                                    specialty_id: el.to.doctor[0].specialty_id
                                },
                                carer: (el.to_user_role === 3) && {
                                    id: el.to.carer[0].id,
                                    specialty_id: el.to.carer[0].specialty_id
                                }
                            }
                        } : {},
                        createdAt: el.createdAt,
                        to_role: el.to_role,
                        status_id: el.status_id
                    });
                });

                return bondData;   
            }
            
            return {
                id: data.id,
                from_user: data.from_user,
                from: data.from.id !== userId ? {
                    id: data.from.id,
                    name: data.from.name,
                    email: data.from.email,
                    telephone: data.from.telephone,
                    birth_day: moment(data.from.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    account_type: {
                        patient: (data.from_user_role === 1) && true,
                        doctor: (data.from_user_role === 2) && {
                            id: data.from.doctor[0].id,
                            crm: data.from.doctor[0].crm,
                            crm_state: data.from.doctor[0].crm_state,
                            crm_verified: data.from.doctor[0].crm_verified,
                            specialty_id: data.from.doctor[0].specialty_id
                        },
                        carer: (data.from_user_role === 3) && {
                            id: data.from.carer[0].id,
                            specialty_id: data.from.carer[0].specialty_id
                        }
                    }
                } : {},
                to_user: data.to_user,
                to: data.to.id !== userId ? {
                    id: data.to.id,
                    name: data.to.name,
                    email: data.to.email,
                    telephone: data.to.telephone,
                    birth_day: moment(data.to.birth_day.toISOString(), 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    account_type: {
                        patient: (data.to_user_role === 1) && true,
                        doctor: (data.to_user_role === 2) && {
                            id: data.to.doctor[0].id,
                            crm: data.to.doctor[0].crm,
                            crm_state: data.to.doctor[0].crm_state,
                            crm_verified: data.to.doctor[0].crm_verified,
                            specialty_id: data.to.doctor[0].specialty_id
                        },
                        carer: (data.to_user_role === 3) && {
                            id: data.to.carer[0].id,
                            specialty_id: data.to.carer[0].specialty_id
                        }
                    }
                } : {},
                status_id: data.status_id
            }    
        } else if(reqMethod === 'POST' || reqMethod === 'DELETE') {
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