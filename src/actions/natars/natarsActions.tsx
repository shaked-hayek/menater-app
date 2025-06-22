import { SetStateAction, Dispatch } from 'react';
import { CITY_DATA, SERVER_IP } from 'consts/settings.const';
import { ROUTES } from 'actions/routes';
import { Natar, RecommendedNatar, mapNatars } from 'components/Interfaces/Natar';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from '@arcgis/core/rest/support/Query';
import { ARCGIS_SETTINGS } from 'consts/settings.const';
import { waitForArcgisAuth } from 'actions/arcgis/waitForArcgisAuth';


export async function queryNatarsLayer(query: __esri.Query) {
    try {
        const isConnected = await waitForArcgisAuth();
        if (!isConnected) {
            throw new Error('Failed connecting to server');
        }

        const NATAR_LAYER_URL = `${ARCGIS_SETTINGS.SERVER_URL}/rest/services${CITY_DATA.NATARIM_LAYER}`;

        const natarsLayer = new FeatureLayer({
            url: NATAR_LAYER_URL,
            outFields: ['*'],
        });

        const result = await natarsLayer.queryFeatures(query);
        return result.features;
    } catch (error) {
        throw new Error('Failed to query natars:', error);
    }
};

export async function getOptionalNatars(setNatars : Dispatch<SetStateAction<Natar[]>>) {
    const query = new Query({
        outFields: ['*'],
        returnGeometry: true,
    });

    const natarsList = await queryNatarsLayer(query);
    setNatars(mapNatars(natarsList));
};

export async function editNatarAction(natar: Natar) {

};

export async function deleteNatarAction(natar: Natar) {

};

export async function getRecommendedNatarsIds() {
    const response = await fetch(`${SERVER_IP}${ROUTES.RECOMMENDED_NATARS}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to get natars');
    }
    const natarsIdList = await response.json();
    return natarsIdList;
};

export async function getRecommendedNatars(setNatars : Dispatch<SetStateAction<Natar[]>>) {
    const recNatarsList = await getRecommendedNatarsIds();
    const natarsIdList = recNatarsList.map((item: RecommendedNatar) => item.id);
    const natarsList = await getNatarsByIds(natarsIdList);
    setNatars(mapNatars(natarsList));
};

export async function getNatarsByIds(idList : number[]) {
    if (!idList || idList.length === 0) return [];

    const whereClause = `OBJECTID IN (${idList.join(',')})`;

    const query = new Query({
        where: whereClause,
        outFields: ['*'],
        returnGeometry: true,
    });

    const result = await queryNatarsLayer(query);
    return result;
};
