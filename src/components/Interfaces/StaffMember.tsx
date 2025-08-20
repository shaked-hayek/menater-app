
export enum StaffOccupation {
    DOCTOR = 'רופא/ה',
    PARAMEDIC = 'פרמדיק/ית',
    ASSISTANT = 'מסייע/ת',
}

export const isValidOccupation = (occupation: string): occupation is StaffOccupation => {
    return Object.values(StaffOccupation).includes(occupation as StaffOccupation);
};

export interface StaffMember {
    id: string;
    name: string;
    occupation: StaffOccupation;
    phoneNumber?: string;
    natarId: number;
}
