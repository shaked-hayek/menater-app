import { useState, useEffect } from 'react';
import { Container, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateStaffMember from 'components/Staff/CreateStaffMember';
import { deleteStaffMemberAction, getStaffMembersAction } from 'actions/staff/staffActions';
import { ErrorPopup } from 'components/atoms/Popups';
import { StaffMember } from '../components/Interfaces/StaffMember';


const ManageStaff = () => {
    // const navigate = useNavigate();
    const { t } = useTranslation();
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [isLoading, setIsLoading] = useState(false); // TODO: use
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchStaff = async () => {
          try {
            await getStaffMembersAction(setStaffMembers);
          } catch (error) {
            setErrorMessage(t('manageStaff.errorMsgs.serverGetError'));
            setShowErrorPopup(true);
          }
        };
        
        fetchStaff();
      }, []);
    

    async function deleteStaffMember(staffMember : StaffMember) {
        try {
            await deleteStaffMemberAction(staffMember);
        } catch (error) {
            setErrorMessage(t('manageStaff.errorMsgs.serverDeleteError'));
            setShowErrorPopup(true);
            return;
        }
        setStaffMembers(prev =>
            prev.filter(member => member.name !== staffMember.name)
        );
    }

    return (
        <Container sx={{ height: '100%', width: '100%' }}>
            <Grid container spacing={3}>
                <Grid size={4}>
                    <ColoredSideBox title={t('manageStaff.existingStaff')} >
                        <List>
                            {staffMembers.map((staff, index) => (
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
                    <CreateStaffMember/>
                </Grid>
            </Grid>

            <ErrorPopup errorMessage={errorMessage} showErrorPopup={showErrorPopup} setShowErrorPopup={setShowErrorPopup} />
        </Container>
    );
};

export default ManageStaff;