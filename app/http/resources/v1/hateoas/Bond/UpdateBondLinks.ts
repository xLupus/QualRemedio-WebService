import { port } from "../../../../../../config/server";
import { apiContext } from "../../../../../../routes/v1/api";

class StoreBondLinks {
    _links(bondId: number | undefined): object[] {
        return [
            {
                href: `http://localhost:${port}/${apiContext}/user/bond`,
                rel: 'bond_an_user',
                method: 'POST'
            },
            {
                href: `http://localhost:${port}/${apiContext}/user/bond`,
                rel: 'list_all_user_bonds',
                method: 'GET'
            },
            {
                href: `http://localhost:${port}/${apiContext}/user/bond/${bondId}`,
                rel: 'list_user_bond',
                method: 'GET'
            },
            {
                href: `http://localhost:${port}/${apiContext}/user/bond/${bondId}`,
                rel: 'unlink_an_user',
                method: 'DELETE'
            }
        ];
    }
}

export default new StoreBondLinks();