export class NotificationResource {
    constructor(data: any, reqMethod?: string | undefined) {
        return this.resource(data, reqMethod) as any;
    }
    
    resource({ data }: { data: any }, reqMethod?: string | undefined) {
        if(reqMethod === 'GET' && data.length !== undefined) {
            const bondData: unknown[] = [];

            data.map((el: any) => {
                bondData.push({
                    id: el.id,
                    title: el.title,
                    message: el.message,
                    read: el.read
                });
            });

            return bondData;   
        }

        return {
            id: data.id,
            title: data.title,
            message: data.message,
            read: data.read
        }
    }
}