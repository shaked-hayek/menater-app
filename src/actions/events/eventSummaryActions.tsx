import { HTTP_HEADERS, SERVER_IP } from 'consts/settings.const';
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
        headers: HTTP_HEADERS,
        body: JSON.stringify({ eventId }),
    });

    if (!response.ok) {
        throw new Error('Failed to create event summary');
    }

    return await response.json();
}

export async function clearEventDataAction() {
    const response = await fetch(`${SERVER_IP}${ROUTES.EVENT_SUMMARY}/clear`, {
        method: 'POST',
        headers: HTTP_HEADERS,
    });

    if (!response.ok) {
        throw new Error('Failed to clear event data');
    }

    return await response.json();
}

export async function loadEventDataFromSummaryAction(eventId: string) {
    const response = await fetch(`${SERVER_IP}${ROUTES.EVENT_SUMMARY}/load/${eventId}`, {
        method: 'POST',
        headers: HTTP_HEADERS,
    });

    if (!response.ok) {
        throw new Error('Failed to load event data from summary');
    }

    return await response.json();
}
