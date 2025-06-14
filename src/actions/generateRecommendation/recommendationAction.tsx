import { ROUTES } from "actions/routes";
import { SERVER_IP } from "consts/settings.const";

export async function generateRecommendation() {
    const response = await fetch(`${SERVER_IP}${ROUTES.GENERATE_RECOMMENDATION}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to get recommendation');
    }
    return true;
};