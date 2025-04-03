import { SetStateAction, Dispatch } from 'react';
import { HTTP_HEADERS, SERVER_IP } from 'consts/settings.const';
import { StaffMember } from 'pages/ManageStaff';
import { ROUTES } from 'actions/routes';

export async function getStaffMembersAction(setStaff : Dispatch<SetStateAction<StaffMember[]>>) {
    const response = await fetch(`${SERVER_IP}${ROUTES.STAFF}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to get staff members');
    }
    const staffList = await response.json();
    setStaff(staffList);
};

export async function addStaffMemberAction(staffMember : StaffMember) {
    const response = await fetch(`${SERVER_IP}${ROUTES.STAFF}`, {
        method: 'POST',
        headers: HTTP_HEADERS,
        body: JSON.stringify(staffMember),
    });
    if (!response.ok) {
        throw new Error('Failed to add staff member');
    }
};

export async function deleteStaffMemberAction(staffMember : StaffMember) {
    const response = await fetch(`${SERVER_IP}${ROUTES.STAFF}`, {
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