import { useState, useEffect } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { Natar } from 'components/Interfaces/Natar';
import { SecondaryButton } from 'components/atoms/Buttons';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { useTranslation } from 'react-i18next';
import ChooseStaff from './ChooseStaff';
import { StaffMember } from 'components/Interfaces/StaffMember';
import { getStaffMembersOfNatarAction } from 'actions/staff/staffActions';
import { SetStateAction, Dispatch } from 'react';
import { errorHandler } from 'actions/errors/errorHandler';
import { useDispatch } from 'react-redux';


const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    height: '85%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: 'center',
};

interface AssignStaffToNatarProps {
    natar: Natar;
    staffMembers: StaffMember[];
    setStaffMembers: Dispatch<SetStateAction<StaffMember[]>>;
    natarIdToNameMap: Record<number, string>;
}

const AssignStaffToNatar = ({ natar, staffMembers, setStaffMembers, natarIdToNameMap } : AssignStaffToNatarProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    
    useEffect(() => {
        const fetchStaff = async () => {
          try {
            await getStaffMembersOfNatarAction(natar.id, setStaffMembers);
          } catch (error) {
            errorHandler(dispatch, t('manageStaff.errorMsgs.serverGetError'), error);
          }
        };
        
        fetchStaff();
    }, []);

    const onAssignStaff = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Typography variant='body1' fontWeight={'bold'}>
                {t('manageStaff.assignedStaff')}
            </Typography>
            <Box mb={2} mt={2} >
                <ColoredSideBox height='60px'>
                    <Box>
                        {staffMembers.map((staff, index) => (
                            <Box
                                key={index}
                                display='grid'
                                gridTemplateColumns='1fr 1fr 1fr'
                            >
                                <Typography variant='body2'>{staff.name}</Typography>
                                <Typography variant='body2'>{staff.occupation}</Typography>
                                <Typography variant='body2'>{staff.phoneNumber}</Typography>
                            </Box>
                        ))}
                    </Box>
                </ColoredSideBox>
            </Box>
            <SecondaryButton onClick={onAssignStaff}>{t('manageStaff.assignStaff')}</SecondaryButton>

            <Modal open={isModalOpen} onClose={closeModal}>
                <Box sx={modalStyle}>
                    <ChooseStaff
                        natar={natar}
                        mainStaffMembers={staffMembers}
                        setMainStaffMembers={setStaffMembers}
                        onClose={closeModal}
                        natarIdToNameMap={natarIdToNameMap}
                    />
                </Box>
            </Modal>
        </>
    );
}

export default AssignStaffToNatar;