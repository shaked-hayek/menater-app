import { SetStateAction, Dispatch } from 'react';
import { SERVER_IP } from 'consts/settings.const';
import { ROUTES } from 'actions/routes';
import { Natar, mapNatars } from 'components/Interfaces/Natar';

// export async function getOptionalNatars(setNatars : Dispatch<SetStateAction<Natar[]>>) {
//     const response = await fetch(`${SERVER_IP}${ROUTES.NATARS}`, {
//         method: 'GET',
//     });
//     if (!response.ok) {
//         throw new Error('Failed to get natars');
//     }
//     const natarsList = await response.json();
//     setNatars(natarsList);
// };

export async function getRecommendedNatars(setNatars : Dispatch<SetStateAction<Natar[]>>) {
    const response = await fetch(`${SERVER_IP}${ROUTES.RECOMMENDED_NATARS}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to get natars');
    }
    const natarsList = await response.json();
    setNatars(mapNatars(natarsList));
};
