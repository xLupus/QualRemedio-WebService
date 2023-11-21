import moment from 'moment';

export class BondPermissionResource {
    constructor(data: any, reqMethod?: string | undefined) {
        return this.resource(data, reqMethod) as any;
    }
    
    resource({ data, userId }: { data: any, userId?: number | undefined}, reqMethod?: string | undefined) {
        if(reqMethod === 'GET') {
          /*

          */
        }

        return {}
    }
}