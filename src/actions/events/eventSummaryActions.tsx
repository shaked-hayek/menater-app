import { SERVER_IP } from 'consts/settings.const';
import { ROUTES } from 'actions/routes';

export async function getEventSummaryAction(eventId: string) {
    const response = await fetch(`${SERVER_IP}${ROUTES.EVENT_SUMMARY}?eventId=${eventId}`, {
        method: 'GET',
    });

    if (!response.ok) {
        if (response.status == 404) {
            return false;
        }
        throw new Error('Failed to get event summary');
    }

    return await response.json();
}

export async function createEventSummaryAction(eventId: string) {
    const response = await fetch(`${SERVER_IP}${ROUTES.EVENT_SUMMARY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
    });

    if (!response.ok) {
        throw new Error('Failed to create event summary');
    }

    return await response.json();
}