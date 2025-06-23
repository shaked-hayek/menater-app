import { SetStateAction, Dispatch } from 'react';
import { CITY_DATA, SERVER_IP } from 'consts/settings.const';
import { ROUTES } from 'actions/routes';
import { Natar, RecommendedNatar, convertNatarToRaw, mapNatars } from 'components/Interfaces/Natar';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
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
    const query = new Query({
        where: `OBJECTID = ${natar.id}`,
        outFields: ['*'],
        returnGeometry: true,
    });

    const features = await queryNatarsLayer(query);
    const existingFeature = features[0];

    if (!existingFeature) {
        throw new Error(`Natar with id ${natar.id} not found`);
    }

    const updatedFeature = new Graphic({
        geometry: existingFeature.geometry,
        attributes: {
            ...existingFeature.attributes,
            ...convertNatarToRaw(natar),
        },
    });

    const layer = existingFeature.layer as FeatureLayer;
    const result = await layer.applyEdits({ updateFeatures: [updatedFeature] });

    if (result.updateFeatureResults[0].error) {
        throw new Error('Failed to update natar: ' + result.updateFeatureResults[0].error.message);
    }
    return true;
};


export async function deleteNatarAction(natar: Natar) {
    const query = new Query({
        where: `OBJECTID = ${natar.id}`,
        returnGeometry: true,
    });

    const features = await queryNatarsLayer(query);
    const featureToDelete = features[0];

    if (!featureToDelete) {
        throw new Error(`Natar with id ${natar.id} not found`);
    }

    const layer = featureToDelete.layer as FeatureLayer;
    const result = await layer.applyEdits({ deleteFeatures: [featureToDelete] });

    if (result.deleteFeatureResults[0].error) {
        throw new Error('Failed to delete natar: ' + result.deleteFeatureResults[0].error.message);
    }
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
