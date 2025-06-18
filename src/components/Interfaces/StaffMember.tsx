
export enum StaffOccupation {
    DOCTOR = 'doctor',
    PARAMEDIC = 'paramedic',
    ASSISTANT = 'assistant',
}

export interface StaffMember {
    id: string;
    name: string;
    occupation: StaffOccupation;
    status?: string;
    phoneNumber?: string;
    natarId: number;
}
