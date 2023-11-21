import moment from 'moment';

export class ReminderResource {
    constructor(data: any, reqMethod?: string | undefined) {
        return this.resource(data, reqMethod) as any;
    }
    
    resource({ data }: { data: any }, reqMethod?: string | undefined) {
        if(reqMethod === 'GET' && data.length !== undefined) {
            const bondData: unknown[] = [];

            data.map((el: any) => {
                bondData.push({
                    id: el.id,
                    label: el.label,
                    date_time: moment(el.date_time.toISOString(), 'YYYY-MM-DD hh:mm:ss').format('DD-MM-YYYY hh:mm:ss')
                });
            });

            return bondData;   
        }

        return {
            id: data.id,
            label: data.label,
            date_time: moment(data.date_time.toISOString(), 'YYYY-MM-DD hh:mm:ss').format('DD-MM-YYYY hh:mm:ss')
        }
    }
}