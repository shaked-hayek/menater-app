import { SetStateAction, Dispatch } from 'react';
import { HTTP_HEADERS, SERVER_IP } from 'consts/settings.const';
import { StaffMember } from 'components/Interfaces/StaffMember';
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
    const data = await response.json();
    return data.id;
};

export async function deleteStaffMemberAction(staffMember : StaffMember) {
    const response = await fetch(`${SERVER_IP}${ROUTES.STAFF}`, {
        method: 'DELETE',
        headers: HTTP_HEADERS,
        body: JSON.stringify({
            id: staffMember.id,
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to delete staff member');
    }
};


// Assign to natar:

export async function getStaffMembersOfNatarAction(natarId: number, setStaff : Dispatch<SetStateAction<StaffMember[]>>) {
    const response = await fetch(`${SERVER_IP}${ROUTES.STAFF}?natarId=${natarId}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to get staff members');
    }
    const staffList = await response.json();
    setStaff(staffList);
};

export async function bulkUpdateStaffNatarAction(staffIds: string[], natarId: number) {
    const response = await fetch(`${SERVER_IP}${ROUTES.STAFF_UPDATE}`, {
        method: 'PUT',
        headers: HTTP_HEADERS,
        body: JSON.stringify({
            staffIds: staffIds || [],
            natarId,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update staff members');
    }

    const result = await response.json();
    return result;
};
