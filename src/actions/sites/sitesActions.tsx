import { SetStateAction, Dispatch } from 'react';
import { HTTP_HEADERS, SERVER_IP } from 'consts/settings.const';
import { ROUTES } from 'actions/routes';
import { Site } from 'pages/DestructionSites';

export async function getSites(setSites : Dispatch<SetStateAction<Site[]>>) {
    const response = await fetch(`${SERVER_IP}${ROUTES.SITES}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to get sites');
    }
    const sitesList = await response.json();
    setSites(sitesList);
};

export async function addSiteAction(site : Site) {
    const response = await fetch(`${SERVER_IP}${ROUTES.SITES}`, {
        method: 'POST',
        headers: HTTP_HEADERS,
        body: JSON.stringify(site),
    });
    if (!response.ok) {
        throw new Error('Failed to add site');
    }
};

export async function deleteSiteAction(site : Site) {
    const response = await fetch(`${SERVER_IP}${ROUTES.SITES}`, {
        method: 'DELETE',
        headers: HTTP_HEADERS,
        body: JSON.stringify({
            street: site.street,
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to delete site');
    }
};
