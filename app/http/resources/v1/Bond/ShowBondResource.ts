export class ShowBondResource {
    constructor(data: any) {
        return this.resource(data) as any;
    }

    resource(data: any) {
        return {
            id: data.id,
            from_user: data.from_user,
            to_user: data.to_user,
            status_id: data.status_id
        }
    }
}