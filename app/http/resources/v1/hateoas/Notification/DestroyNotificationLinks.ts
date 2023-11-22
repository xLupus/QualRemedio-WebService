import { port } from "../../../../../../config/server";
import { apiContext } from "../../../../../../routes/v1/api";

class DestroyNotificationLinks {
    _links(): object[] {
        return [
            {
                href: `http://localhost:${port}/${apiContext}/users/notifications`,
                rel: 'list_all_user_notifications',
                method: 'GET'
            },
            {
                href: `http://localhost:${port}/${apiContext}/users/notifications`,
                rel: 'create_an_user_notification',
                method: 'POST'
            }
        ];
    }
}

export default new DestroyNotificationLinks();