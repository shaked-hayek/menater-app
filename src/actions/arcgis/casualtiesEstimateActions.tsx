import { SetStateAction, Dispatch } from 'react';
import Query from '@arcgis/core/rest/support/Query';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { ARCGIS_SETTINGS, CITY_DATA } from 'consts/settings.const';

const AVG_PEOPLE_APARTMENT = 3;
const RESIDENTIAL_DAY_TIME = 0.2;
const PUBLIC_DAY_TIME = 1;
const RESIDENTIAL_NIGHT_TIME = 1;
const PUBLIC_NIGHT_TIME = 0;

export const getFeatureLayer = async () => {
    const featureLayer = new FeatureLayer({
        url: `${ARCGIS_SETTINGS.SERVER_URL}/rest/services${CITY_DATA.CITY_MAP_LOC}`,
        outFields: ['*'],
    });
    await featureLayer.load();
    return featureLayer;
};

export const getCasualtiesEstimate = async (
  streetName: string,
  number: string,
  setCasualtiesEstimate: Dispatch<SetStateAction<string>>,
  earthquakeTimeIsDayTime: boolean,
) => {
    const layer = await getFeatureLayer();

    const query = new Query({
        where: `Street_Name = '${streetName}' AND House_Number = '${number}'`,
        outFields: ['Apartments', 'Floors', 'Residence'],
        returnGeometry: false,
    });

    try {
        const result = await layer.queryFeatures(query);
        if (result.features.length > 0) {
            const attr = result.features[0].attributes;

            const maxPeople = attr.Floors * attr.Apartments * AVG_PEOPLE_APARTMENT;
            let estimate;
            if (earthquakeTimeIsDayTime) {
                estimate = attr.Residence
                    ? maxPeople * RESIDENTIAL_DAY_TIME
                    : maxPeople * PUBLIC_DAY_TIME;
            } else {
                estimate = attr.Residence
                    ? maxPeople * RESIDENTIAL_NIGHT_TIME
                    : maxPeople * PUBLIC_NIGHT_TIME;
            }
            const roundedEstimate = Math.ceil(estimate);
            setCasualtiesEstimate(roundedEstimate.toString());
            return;
        }
    } catch (err) {
        console.error('Error fetching estimate', err);
    }
    setCasualtiesEstimate('');
};
