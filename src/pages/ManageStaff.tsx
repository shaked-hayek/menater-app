import { useState, useEffect } from 'react';
import { Container, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateStaffMember from 'components/Staff/CreateStaffMember';
import { deleteStaffMemberAction, getStaffMembersAction } from 'actions/staff/staffActions';
import { StaffMember } from '../components/Interfaces/StaffMember';
import { useDispatch } from 'react-redux';
import { errorHandler } from 'actions/errors/errorHandler';


const ManageStaff = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                await getStaffMembersAction(setStaffMembers);
            } catch (error) {
                errorHandler(dispatch, t('manageStaff.errorMsgs.serverGetError'), error);
            }
        };
        
        fetchStaff();
      }, []);

    async function deleteStaffMember(staffMember : StaffMember) {
        try {
            await deleteStaffMemberAction(staffMember);
        } catch (error) {
            errorHandler(dispatch, t('manageStaff.errorMsgs.serverDeleteError'), error);
            return;
        }
        setStaffMembers(prev =>
            prev.filter(member => member.name !== staffMember.name)
        );
    }

    const onStaffCreate = (newStaff: StaffMember) => {
        setStaffMembers([...staffMembers, newStaff]);
    };

    return (
        <Container sx={{ height: '100%', width: '100%' }}>
            <Grid container spacing={3}>
                <Grid size={4}>
                    <ColoredSideBox title={t('manageStaff.existingStaff')} >
                        <List>
                            {[...staffMembers]
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((staff, index) => (
                                    <ListItem
                                        key={index}
                                        disableGutters
                                        secondaryAction={
                                            <IconButton edge="start" onClick={() => deleteStaffMember(staff)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={`${staff.name}`}
                                            secondary={
                                                `${t('manageStaff.occupation')}: ${staff.occupation}` +
                                                (staff.phoneNumber ? (
                                                    `, ${t('manageStaff.phone')}: ${staff.phoneNumber}`
                                                ) : '')}
                                            sx={{ textAlign: 'right' }}
                                        />
                                    </ListItem>
                            ))}
                        </List>
                    </ColoredSideBox>
                </Grid>
                <Grid size={8}>
                    <CreateStaffMember onCreate={onStaffCreate} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default ManageStaff;