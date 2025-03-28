import { useState, useEffect } from 'react';
import { IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateStaffMember from 'components/Staff/CreateStaffMember';
import { getStaffMembers } from 'actions/staff/staffActions';

export interface StaffMember {
    name: string;
    occupation: string;
    status?: string
    phoneNumber?: string;
}

const ManageStaff = () => {
    // const navigate = useNavigate();
    const { t } = useTranslation();
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);

    useEffect(() => {
        getStaffMembers(setStaffMembers);
    }, []);
    

    const deleteStaffMember = (index : number) => {

    }

    return (
        <>
            <ColoredSideBox>
                <Typography variant='h6'>{t('manageStaff.existingStaff')}</Typography>
                    <List>
                        {staffMembers.map((site, index) => (
                            <ListItem
                                key={index}
                                disableGutters
                                secondaryAction={
                                    <IconButton edge="start" onClick={() => deleteStaffMember(index)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={`${site.name}`}
                                    secondary={`${t('manageStaff.occupation')}: ${site.occupation}`}
                                    sx={{ textAlign: 'right' }}
                                />
                            </ListItem>
                        ))}
                    </List>
            </ColoredSideBox>
            <CreateStaffMember/>
        </>
    );
};

export default ManageStaff;