import { port } from "../../../../../../config/server";
import { apiContext } from "../../../../../../routes/v1/api";

class ShowReminderLinks {
    _links(reminderId: number | undefined): object[] {
        return [
            {
                href: `http://localhost:${port}/${apiContext}/user/reminder`,
                rel: 'create_an_user_reminder',
                method: 'POST'
            },
            {
                href: `http://localhost:${port}/${apiContext}/user/reminder`,
                rel: 'list_all_user_reminders',
                method: 'GET'
            },
            {
                href: `http://localhost:${port}/${apiContext}/user/reminder/${reminderId}`,
                rel: 'update_an_user_reminder',
                method: 'PATCH'
            },
            {
                href: `http://localhost:${port}/${apiContext}/user/reminder/${reminderId}`,
                rel: 'remove_an_user_reminder',
                method: 'DELETE'
            }
        ];
    }
}

export default new ShowReminderLinks();