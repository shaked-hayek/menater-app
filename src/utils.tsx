import { Dispatch, UnknownAction } from 'redux';
import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';
import { Natar } from 'components/Interfaces/Natar';
import { NATAR_TYPE } from 'consts/natarType.const';
import { setEarthquakeEvent, setMode } from 'store/store';

export const buildNestedNatars = (natars: Natar[]): Natar[] => {
    const mainNatars = natars.filter(n => n.type === NATAR_TYPE.MAIN);
    const secondaryNatars = natars.filter(n => n.fatherNatar !== NATAR_TYPE.SECONDARY);
    
    const nestedList: Natar[] = [];
    
    for (const main of mainNatars) {
        nestedList.push(main);
        const children = secondaryNatars.filter(child => child.fatherNatar === main.id);
        nestedList.push(...children);
    }

    return nestedList;
};

export const setEventDataForSystem = (event: EarthquakeEvent, dispatch: Dispatch<UnknownAction>) => {
    dispatch(setEarthquakeEvent(event));
    dispatch(setMode(event.mode));
};

export const formatDateTime = (dateStr: Date) =>
    new Date(dateStr).toLocaleString('he-IL', {
        timeZone: 'Asia/Jerusalem',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
