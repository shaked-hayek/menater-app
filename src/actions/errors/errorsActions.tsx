import { ROUTES } from 'actions/routes';
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

export async function sendErrorAction(message : String, error : Error) {
    const response = await fetch(`${SERVER_IP}${ROUTES.ERRORS}`, {
        method: 'POST',
        headers: HTTP_HEADERS,
        body: JSON.stringify({
            message,
            error
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to add error');
    }
};