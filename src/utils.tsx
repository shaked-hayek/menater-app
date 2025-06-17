import { Natar } from "components/Interfaces/Natar";
import { NATAR_TYPE } from "consts/natarType.const";

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