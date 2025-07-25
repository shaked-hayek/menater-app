import { SetStateAction, Dispatch } from 'react';
import { HTTP_HEADERS, SERVER_IP } from 'consts/settings.const';
import { ROUTES } from 'actions/routes';
import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';


export async function getEventsAction() {
    const response = await fetch(`${SERVER_IP}${ROUTES.EVENTS}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to get events');
    }
    const eventsList = await response.json();
    return eventsList;
};

export async function getEventByIdAction(eventId : string) {
    const response = await fetch(`${SERVER_IP}${ROUTES.EVENTS}?eventId=${eventId}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to get event');
    }
    const event = await response.json();
    return event;
};

export async function addEventAction(event : EarthquakeEvent) {
    const response = await fetch(`${SERVER_IP}${ROUTES.EVENTS}`, {
        method: 'POST',
        headers: HTTP_HEADERS,
        body: JSON.stringify(event),
    });
    if (!response.ok) {
        throw new Error('Failed to add event');
    }
    const result = await response.json();
    return result.id;
};