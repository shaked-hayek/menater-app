import { ROUTES } from "actions/routes";
import { HTTP_HEADERS, SERVER_IP } from "consts/settings.const";

export async function updateNatarOpenedStatus(id: number, opened: boolean) {
    const response = await fetch(`${SERVER_IP}${ROUTES.NATARS}?id=${id}&opened=${opened}`, {
        method: 'PUT',
        headers: HTTP_HEADERS,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update natar: ${errorText}`);
    }
}
