

export interface DestructionSite {
  buildingId: number;
  street: string;
  number: string;
  casualties: number;
  wasUsedInRec?: boolean | null;
  coupledNatarId?: number | null;
}
