import { ROUTES } from "actions/routes";
import { HTTP_HEADERS, SERVER_IP } from "consts/settings.const";

export async function initializeDBAction() {
    const response = await fetch(`${SERVER_IP}${ROUTES.INIT_DB}`, {
        method: 'DELETE',
        headers: HTTP_HEADERS,
    });
    if (!response.ok) {
        throw new Error('Failed to initialize DB');
    }
};