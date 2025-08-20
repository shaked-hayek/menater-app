import { ROUTES } from "actions/routes";
import { StaffMember, isValidOccupation } from "components/Interfaces/StaffMember";
import { HTTP_HEADERS, SERVER_IP } from "consts/settings.const";


const parseCsvToStaff = (csvFileContent: string) => {
    const lines = csvFileContent.trim().split('\n');

    const staffList = lines
        .map(line => {
            const [name, occupation, phoneNumber] = line.split(',');
            const trimmedName = name?.trim();
            const trimmedOccupation = occupation?.trim();

            if (!trimmedName || !trimmedOccupation || !isValidOccupation(trimmedOccupation)) {
                console.warn("Skipped staff member: ", trimmedName);
                return null;
            }

            return {
                name: trimmedName,
                occupation: trimmedOccupation,
                phoneNumber: phoneNumber?.trim() || '',
            } as Partial<StaffMember>;
        })
        .filter((staff): staff is Partial<StaffMember> => staff !== null);

    return staffList;
};


export async function staffBulkUpload(csvFileContent: string) {
    const staffList = parseCsvToStaff(csvFileContent);
    if (staffList.length === 0) {
        throw new Error('No valid staff members to upload');
    }

    const response = await fetch(`${SERVER_IP}${ROUTES.STAFF_BULK_UPLOAD}`, {
        method: 'POST',
        headers: HTTP_HEADERS,
        body: JSON.stringify(staffList),
    });

    if (!response.ok) {
        throw new Error('Failed to upload staff members');
    }

    return response.json();
}
