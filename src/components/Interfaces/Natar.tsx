import { NATAR_TYPE } from "consts/natarType.const";
import { TFunction } from "i18next";

export interface Natar {
    id: number;
    name: string;
    type: NATAR_TYPE;
    fatherNatar?: number;
    address?: string;
    capacity?: number;
    equipmentLocation?: string;
    lastUpdateDate?: string;
    nature?: string;
    terrainType?: string;
    carAccess?: boolean;
    gasStationNear?: boolean;
    shade?: boolean;
    availableFacilities?: string;
    lat: number;
    long: number;
    wasOpened: boolean;
}


export interface RecommendedNatar {
    id: number;
    date: Date;
}


export const mapNatars = (rawNatars: any) => {
    const mappedNatars: Natar[] = rawNatars.map((natar: any, index: number) => ({
        id: natar.attributes.OBJECTID || index,
        name: natar.attributes.Name?.trim() || 'ללא שם',
        type: natar.attributes.father == 0 ? NATAR_TYPE.MAIN : NATAR_TYPE.SECONDARY,
        fatherNatar: natar.attributes.father,
        address: natar.attributes.Address?.trim() || undefined,
        capacity: natar.attributes.capacity || undefined,
        equipmentLocation: natar.attributes.Equipment?.trim() || undefined,
        lastUpdateDate: natar.attributes.Last_Update || undefined,
        nature: natar.attributes.Type?.toString(),
        terrainType: natar.attributes.surface_1?.trim() || undefined,
        carAccess: Boolean(natar.attributes.car_access),
        gasStationNear: Boolean(natar.attributes.Gas),
        shade: Boolean(natar.attributes.conv_shado),
        availableFacilities: natar.attributes.Avail_Faci?.trim() || undefined,
        lat: natar.attributes.LAT,
        long: natar.attributes.LONG,
        wasOpened: false,
      }));
    return mappedNatars
}

export const getNatarFields = (t: TFunction<'translation', undefined>): { key: keyof Natar; label: string }[] => [
  { key: 'id', label: t('openNatar.natarDetails.id') },
  { key: 'address', label: t('openNatar.natarDetails.address') },
  { key: 'capacity', label: t('openNatar.natarDetails.capacity') },
  { key: 'equipmentLocation', label: t('openNatar.natarDetails.equipmentLocation') },
  { key: 'lastUpdateDate', label: t('openNatar.natarDetails.lastUpdateDate') },
  { key: 'nature', label: t('openNatar.natarDetails.nature') },
  { key: 'terrainType', label: t('openNatar.natarDetails.terrainType') },
  { key: 'carAccess', label: t('openNatar.natarDetails.vehicleApproach') },
  { key: 'gasStationNear', label: t('openNatar.natarDetails.gasStationNear') },
  { key: 'shade', label: t('openNatar.natarDetails.shade') },
  { key: 'availableFacilities', label: t('openNatar.natarDetails.availableFacilities') },
];
