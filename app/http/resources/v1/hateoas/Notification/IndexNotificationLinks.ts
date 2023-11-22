import { port } from "../../../../../../config/server";
import { apiContext } from "../../../../../../routes/v1/api";

class IndexNotificationLinks {
    _links(): object[] {
        return [
            {
                href: `http://localhost:${port}/${apiContext}/users/notifications`,
                rel: 'create_an_user_notification',
                method: 'POST'
            }
        ];
    }
}

export default new IndexNotificationLinks();