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
    vehicleApproach?: string;
    gasStationNear?: string;
    shade?: string;
    availableFacilities?: string;
}
