import { port } from "../../../../../../config/server";
import { apiContext } from "../../../../../../routes/v1/api";

class IndexReminderLinks {
    _links(): object[] {
        return [
            {
                href: `http://localhost:${port}/${apiContext}/user/reminder`,
                rel: 'create_an_user_reminder',
                method: 'POST'
            }
        ];
    }
}

export default new IndexReminderLinks();