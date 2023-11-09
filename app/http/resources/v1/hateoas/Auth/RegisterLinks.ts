import { port } from "../../../../../../config/server";
import { apiContext } from "../../../../../../routes/v1/api";

class RegisterLinks {
    _links(): object[] {
        return [
            {
                href: `http://localhost:${port}/${apiContext}/auth/login`,
                rel: 'log_in_an_user',
                method: 'POST'
            }
        ];
    }
}

export default new RegisterLinks();