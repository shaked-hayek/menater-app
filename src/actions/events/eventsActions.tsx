import { SetStateAction, Dispatch } from 'react';
import { HTTP_HEADERS, SERVER_IP } from 'consts/settings.const';
import { ROUTES } from 'actions/routes';
import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';


export async function getEventsAction(setEvents : Dispatch<SetStateAction<EarthquakeEvent[]>>) {
    const response = await fetch(`${SERVER_IP}${ROUTES.EVENTS}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to get events');
    }
    const eventsList = await response.json();
    setEvents(eventsList);
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
};