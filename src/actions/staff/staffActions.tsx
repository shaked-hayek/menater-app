import { SetStateAction, Dispatch } from 'react';
import { HTTP_HEADERS, SERVER_IP } from 'consts/settings.const';
import { StaffMember } from 'pages/ManageStaff';

export async function getStaffMembersAction(setStaff : Dispatch<SetStateAction<StaffMember[]>>) {
    const response = await fetch(`${SERVER_IP}/staff`, {
        method: 'GET',
    });
    const staffList = await response.json();
    setStaff(staffList);
    return response.ok ? true : false; // TODO: throw error and handle it
};

export async function addStaffMemberAction(staffMember : StaffMember) {
    const response = await fetch(`${SERVER_IP}/staff`, {
        method: 'POST',
        headers: HTTP_HEADERS,
        body: JSON.stringify(staffMember),
    });
    return response.ok ? true : false;
};

export async function deleteStaffMemberAction(staffMember : StaffMember) {
    const response = await fetch(`${SERVER_IP}/staff`, {
        method: 'DELETE',
        headers: HTTP_HEADERS,
        body: JSON.stringify({
            name: staffMember.name,
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to delete staff member');
    }
};