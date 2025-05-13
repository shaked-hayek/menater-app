import { SetStateAction, Dispatch } from 'react';
import { ROUTES } from 'actions/routes';
import { SERVER_IP } from 'consts/settings.const';

export async function getCasualtiesEstimate(street: string, streetNumber: string, setCasualtiesEstimate: Dispatch<SetStateAction<string>>) {
    const response = await fetch(
            `${SERVER_IP}${ROUTES.CASUALTIES_ESTIMATE}?street=${street}&number=${streetNumber}`, 
            {
                method: 'GET',
            }
    );
    if (!response.ok) {
        throw new Error('Failed to get casualties estimate');
    }
    const estimate = await response.json();
    setCasualtiesEstimate(estimate.estimate);
};