export class BondPermissionResource {
    constructor(data: any) {
        return this.resource(data) as any;
    }
    
    resource({ data, userId }: { data: any, userId?: number | undefined}) {
        return {
            id: data.id,
            permission_id: data.permission_id,
            bond_id: data.bond_id,
        }
    }
}