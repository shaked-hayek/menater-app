import { SetStateAction, Dispatch } from 'react';
import { SERVER_IP } from 'consts/settings.const';
import { StaffMember } from 'pages/ManageStaff';

export async function getStaffMembers(setStaff : Dispatch<SetStateAction<StaffMember[]>>) {
    const response = await fetch(`${SERVER_IP}/staff`);
    const staffList = await response.json();
    setStaff(staffList);
};

export async function addStaffMember(staffMember : StaffMember) {
    const response = await fetch(`${SERVER_IP}/staff`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffMember),
    });
};