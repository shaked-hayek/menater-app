import Query from '@arcgis/core/rest/support/Query';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { ARCGIS_SETTINGS, CITY_DATA } from 'consts/settings.const';


export const getFeatureLayer = async () => {
    const featureLayer = new FeatureLayer({
        url: `${ARCGIS_SETTINGS.SERVER_URL}/rest/services${CITY_DATA.CITY_MAP_LOC}`,
        outFields: ['*'],
    });
    await featureLayer.load();
    return featureLayer;
};

export const getBuildingId = async (
  streetName: string,
  number: string,
) => {
    const layer = await getFeatureLayer();

    const query = new Query({
        where: `Street_Name = '${streetName}' AND House_Number = '${number}'`,
        outFields: ['OBJECTID'],
        returnGeometry: false,
    });

    try {
        const result = await layer.queryFeatures(query);
        if (result.features.length > 0) {
            const attr = result.features[0].attributes;
            return attr.OBJECTID;
        }
    } catch (err) {
        console.error('Error fetching building id', err);
    }
    return null;
};
