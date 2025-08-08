import { ROUTES } from 'actions/routes';
import { MenaterError } from 'components/Interfaces/MenaterError';
import { HTTP_HEADERS, SERVER_IP } from 'consts/settings.const';


export async function getErrorsAction() {
    const response = await fetch(`${SERVER_IP}${ROUTES.ERRORS}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to get errors');
    }
    return await response.json();
};

export async function sendErrorAction(systemError : MenaterError) {
    const response = await fetch(`${SERVER_IP}${ROUTES.ERRORS}`, {
        method: 'POST',
        headers: HTTP_HEADERS,
        body: JSON.stringify(systemError),
    });
    if (!response.ok) {
        throw new Error('Failed to add error');
    }
};