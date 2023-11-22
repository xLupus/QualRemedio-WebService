import { port } from "../../../../../../config/server";
import { apiContext } from "../../../../../../routes/v1/api";

class StoreNotificationLinks {
    _links(notificationId: number | undefined): object[] {
        return [
            {
                href: `http://localhost:${port}/${apiContext}/users/notifications`,
                rel: 'list_all_user_notifications',
                method: 'GET'
            },
            {
                href: `http://localhost:${port}/${apiContext}/users/notifications/${notificationId}`,
                rel: 'list_user_notification',
                method: 'GET'
            },
            {
                href: `http://localhost:${port}/${apiContext}/users/notifications/${notificationId}`,
                rel: 'update_an_user_bond',
                method: 'PATCH'
            },
            {
                href: `http://localhost:${port}/${apiContext}/users/notifications/${notificationId}`,
                rel: 'remove_an_user_notification',
                method: 'DELETE'
            }
        ];
    }
}

export default new StoreNotificationLinks();