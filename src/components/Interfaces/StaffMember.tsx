
export enum StaffOccupation {
    DOCTOR = 'doctor',
    PARAMEDIC = 'paramedic',
    ASSISTANT = 'assistant',
}

export interface StaffMember {
    name: string;
    occupation: StaffOccupation;
    status?: string;
    phoneNumber?: string;
}
