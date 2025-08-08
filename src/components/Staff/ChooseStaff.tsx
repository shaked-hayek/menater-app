import { useState, useEffect } from 'react';
import { SetStateAction, Dispatch } from 'react';
import { Box, Checkbox, Modal, TextField, Typography } from '@mui/material';
import { Natar } from 'components/Interfaces/Natar';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { useTranslation } from 'react-i18next';
import { bulkUpdateStaffNatarAction, getStaffMembersAction } from 'actions/staff/staffActions';
import { StaffMember } from 'components/Interfaces/StaffMember';
import { SecondaryButton } from 'components/atoms/Buttons';
import CreateStaffMember from './CreateStaffMember';
import { useDispatch } from 'react-redux';
import { errorHandler } from 'actions/errors/errorHandler';


const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    height: '60%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: 'center',
};

interface ChooseStaffProps {
    natar: Natar;
    mainStaffMembers: StaffMember[];
    setMainStaffMembers: Dispatch<SetStateAction<StaffMember[]>>;
    onClose: () => void;
}

const ChooseStaff = ({natar, mainStaffMembers, setMainStaffMembers, onClose} : ChooseStaffProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchText, setSearchText] = useState('');
    const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                await getStaffMembersAction(setStaffMembers);
                const initialIds = new Set(mainStaffMembers.map((s) => s.id));
                setSelectedIds(initialIds);
            } catch (error) {
                errorHandler(dispatch, t('manageStaff.errorMsgs.serverGetError'), error);
            }
        };
        
        fetchStaff();
      }, [mainStaffMembers]);

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const onApprove = () => {
        const selected: StaffMember[] = staffMembers.filter((s) => selectedIds.has(s.id));
        setMainStaffMembers(selected);

        const selectedIdsArray: string[] = Array.from(selectedIds);
        bulkUpdateStaffNatarAction(selectedIdsArray, natar.id);
        onClose();
    };

    const onStaffCreate = (newStaff: StaffMember) => {
        setShowCreateStaffModal(false);
        setStaffMembers([...staffMembers, newStaff]);
    };

    const filteredStaff = staffMembers.filter((s) =>
        s.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <Typography variant='h5' mb={2}>
                {t('manageStaff.chooseStaff', { natar: natar.name })}
            </Typography>

            <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
                <SecondaryButton variant='contained' color='primary' onClick={() => setShowCreateStaffModal(true)}>
                    {t('manageStaff.addStaffMember')}
                </SecondaryButton>
            </Box>

            <TextField
                fullWidth
                variant='outlined'
                size='small'
                placeholder={t('manageStaff.searchByName')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{ mb: 2 }}
            />

            <ColoredSideBox height='65%' mb={2}>
                {/* Header */}
                <Box display='flex' borderBottom='1px solid #ccc' py={1} px={2} fontWeight='bold'>
                    <Box width='10%' />
                    <Box width='30%' textAlign='right'>{t('manageStaff.staffName')}</Box>
                    <Box width='30%' textAlign='right'>{t('manageStaff.staffOccupation')}</Box>
                    <Box width='30%' textAlign='right'>{t('manageStaff.staffStatus')}</Box>
                </Box>

                {/* Staff Rows */}
                {[...filteredStaff]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((staff) => {
                    const isAssignedToOtherNatar = staff.natarId !== 0 && staff.natarId !== natar.id;
                    const isDisabled = isAssignedToOtherNatar;

                    return (
                        <Box
                            key={staff.id}
                            display='flex'
                            alignItems='center'
                            py={0.5}
                            px={2}
                            borderBottom='1px solid #eee'
                            sx={{ opacity: isDisabled ? 0.5 : 1 }}
                        >
                            <Box width='10%'>
                                <Checkbox
                                    checked={selectedIds.has(staff.id)}
                                    onChange={() => toggleSelection(staff.id)}
                                    disabled={isDisabled}
                                />
                            </Box>
                            <Box width='30%' textAlign='right'>
                                <Typography variant='body2'>{staff.name}</Typography>
                            </Box>
                            <Box width='30%' textAlign='right'>
                                <Typography variant='body2'>{staff.occupation}</Typography>
                            </Box>
                            <Box width='30%' textAlign='right'>
                                <Typography variant='body2'>
                                    {isAssignedToOtherNatar
                                        ? t('manageStaff.statusAssigned')
                                        : t('manageStaff.statusNotAssigned')}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </ColoredSideBox>

            <SecondaryButton onClick={onApprove}>
                {t('buttons.submit')}
            </SecondaryButton>

            <Modal
                open={showCreateStaffModal}
                onClose={() => setShowCreateStaffModal(false)}
            >
                <Box sx={modalStyle}>
                    <CreateStaffMember onCreate={onStaffCreate} />
                </Box>
            </Modal>
        </>
      );
};

export default ChooseStaff;