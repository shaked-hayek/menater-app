import { useState, useEffect } from 'react';
import { SetStateAction, Dispatch } from 'react';
import { Box, Checkbox, TextField, Typography } from '@mui/material';
import { Natar } from 'components/Interfaces/Natar';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { useTranslation } from 'react-i18next';
import { bulkUpdateStaffNatarAction, getStaffMembersAction } from 'actions/staff/staffActions';
import { StaffMember } from 'components/Interfaces/StaffMember';
import { ErrorPopup } from 'components/atoms/Popups';
import { SecondaryButton } from 'components/atoms/Buttons';

interface ChooseStaffProps {
    natar: Natar;
    mainStaffMembers: StaffMember[];
    setMainStaffMembers: Dispatch<SetStateAction<StaffMember[]>>;
    onClose: () => void;
}

const ChooseStaff = ({natar, mainStaffMembers, setMainStaffMembers, onClose} : ChooseStaffProps) => {
    const { t } = useTranslation();
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchText, setSearchText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchStaff = async () => {
          try {
            await getStaffMembersAction(setStaffMembers);
            const initialIds = new Set(mainStaffMembers.map((s) => s.id));
            setSelectedIds(initialIds);
          } catch (error) {
            setErrorMessage(t('manageStaff.errorMsgs.serverGetError'));
            setShowErrorPopup(true);
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

    const filteredStaff = staffMembers.filter((s) =>
        s.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <Typography variant='h5' mb={2}>
                {t('manageStaff.chooseStaff', { natar: natar.name })}
            </Typography>

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
            {filteredStaff.map((staff) => (
                <Box
                    key={staff.id}
                    display='flex'
                    alignItems='center'
                    py={0.5}
                    px={2}
                    borderBottom='1px solid #eee'
                >
                    <Box width='10%'>
                    <Checkbox
                        checked={selectedIds.has(staff.id)}
                        onChange={() => toggleSelection(staff.id)}
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
                            {staff.natarId === 0
                                ? t('manageStaff.statusNotAssigned')
                                : t('manageStaff.statusAssigned')}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </ColoredSideBox>

        <SecondaryButton onClick={onApprove}>
            {t('buttons.submit')}
        </SecondaryButton>

        <ErrorPopup
            errorMessage={errorMessage}
            showErrorPopup={showErrorPopup}
            setShowErrorPopup={setShowErrorPopup}
          />
        </>
      );
};

export default ChooseStaff;