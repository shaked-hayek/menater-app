import { SetStateAction, Dispatch } from 'react';
import { HTTP_HEADERS, SERVER_IP } from 'consts/settings.const';
import { ROUTES } from 'actions/routes';
import { DestructionSite } from 'components/DestructionSitesComp/DestructionSitesMap';

export async function getSites(setSites : Dispatch<SetStateAction<DestructionSite[]>>) {
    const response = await fetch(`${SERVER_IP}${ROUTES.SITES}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to get sites');
    }
    const sitesList = await response.json();
    setSites(sitesList);
};

export async function addSiteAction(site : DestructionSite) {
    const response = await fetch(`${SERVER_IP}${ROUTES.SITES}`, {
        method: 'POST',
        headers: HTTP_HEADERS,
        body: JSON.stringify(site),
    });
    if (!response.ok) {
        throw new Error('Failed to add site');
    }
};

export async function deleteSiteAction(site : DestructionSite) {
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
