import { port } from "../../../../../../config/server";
import { apiContext } from "../../../../../../routes/v1/api";

class IndexBondLinks {
    _links(): object[] {
        return [
            {
                href: `http://localhost:${port}/${apiContext}/user/bond`,
                rel: 'bond_an_user',
                method: 'POST'
            }
        ];
    }
}

export default new IndexBondLinks();