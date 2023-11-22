import { port } from "../../../../../../config/server";
import { apiContext } from "../../../../../../routes/v1/api";

class UpdateNotificationLinks {
    _links(notificationId: number | undefined): object[] {
        return [
            {
                href: `http://localhost:${port}/${apiContext}/users/notifications`,
                rel: 'create_an_user_notifications',
                method: 'POST'
            },
            {
                href: `http://localhost:${port}/${apiContext}/users/notifications`,
                rel: 'list_all_user_notificationss',
                method: 'GET'
            },
            {
                href: `http://localhost:${port}/${apiContext}/users/notifications/${notificationId}`,
                rel: 'list_user_notifications',
                method: 'GET'
            },
            {
                href: `http://localhost:${port}/${apiContext}/users/notifications/${notificationId}`,
                rel: 'remove_an_user_notifications',
                method: 'DELETE'
            }
        ];
    }
}

export default new UpdateNotificationLinks();