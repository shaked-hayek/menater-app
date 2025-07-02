import { ROUTES } from "actions/routes";
import { HTTP_HEADERS, SERVER_IP } from "consts/settings.const";

export async function generateClosestNatarsAction() {
    const response = await fetch(`${SERVER_IP}${ROUTES.GENERATE_CLOSEST_NATARS_TABLE}`, {
        method: 'POST',
        headers: HTTP_HEADERS,
        body: JSON.stringify({})
    });

    if (!response.ok) {
        throw new Error('Failed to generate closest natars table');
    }
};