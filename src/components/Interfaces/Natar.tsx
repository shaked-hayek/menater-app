import { NATAR_TYPE } from "consts/natarType.const";

export interface Natar {
    id: number;
    name: string;
    type: NATAR_TYPE;
    address?: string;
    capacity?: number;
    equipmentLocation?: string;
    lastUpdateDate?: string;
    nature?: string;
    terrainType?: string;
    carAccess?: string;
    gasStationNear?: string;
    shade?: boolean;
    availableFacilities?: string;
}


export const mapNatars = (rawNatars: any) => {
    const mappedNatars: Natar[] = rawNatars.map((natar: any, index: number) => ({
        id: index,
        name: natar.Name?.trim() || 'ללא שם',
        type: NATAR_TYPE.MAIN,
        address: natar.Address?.trim() || undefined,
        capacity: natar.capacity || undefined,
        equipmentLocation: natar.Equipment?.trim() || undefined,
        lastUpdateDate: natar.Last_Update || undefined,
        nature: natar.Type?.toString(),
        terrainType: natar.surface_1?.trim() || undefined,
        carAccess: natar.car_access?.toString() || undefined,
        gasStationNear: natar.Gas?.toString() || undefined,
        shade: Boolean(natar.conv_shado) || undefined,
        availableFacilities: natar.Avail_Faci?.trim() || undefined,
      }));
    return mappedNatars
}