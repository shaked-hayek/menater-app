

export interface DestructionSite {
  buildingId: number;
  street: string;
  number: string;
  casualties: number;
  geometry?: __esri.GeometryUnion | null;
  wasUsedInRec?: boolean | null;
  coupledNatarId?: number | null;
}
