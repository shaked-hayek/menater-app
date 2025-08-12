import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Natar, getNatarFields } from 'components/Interfaces/Natar';
import AssignStaffToNatar from 'components/Staff/AssignStaffToNatar';
import { MainButton } from 'components/atoms/Buttons';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { NATAR_TYPE } from 'consts/natarType.const';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import SinglePointMap from 'actions/arcgis/SinglePointMap';
import { StaffMember } from 'components/Interfaces/StaffMember';
import { updateNatarOpenedStatus } from 'actions/natars/serverNatarsActions';
import { useDispatch } from 'react-redux';
import { errorHandler } from 'actions/errors/errorHandler';
import { bulkUpdateStaffNatarAction } from 'actions/staff/staffActions';


const MIN_STAFF_NEEDED = 2;

interface AddNatarProps {
    natarDetails: Natar;
    onClose: () => void;
    onMarkAsOpened: (id: number) => void;
    natarIdToNameMap: Record<number, string>;
}

const AddNatar = ({ natarDetails, onClose, onMarkAsOpened, natarIdToNameMap }: AddNatarProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);

    const fields = getNatarFields(t);

    const handleSubmit = async () => {
        if (staffMembers.length < MIN_STAFF_NEEDED) {
            errorHandler(dispatch, t('openNatar.errorMsgs.notEnoughStaff', {amount: MIN_STAFF_NEEDED}));
            return;
        }
        try {
            const selectedIdsArray: string[] = Array.from(staffMembers.map(member => member.id));
            bulkUpdateStaffNatarAction(selectedIdsArray, natarDetails.id);
        } catch(error) {
            errorHandler(dispatch, t('openNatar.errorMsgs.assignStaffError'), error);
            return;
        }
        try {
            await updateNatarOpenedStatus(natarDetails.id, true);
        } catch(error) {
            errorHandler(dispatch, t('openNatar.errorMsgs.serverGetError'), error);
            return;
        }
        onMarkAsOpened(natarDetails.id);
        onClose();
    }
    
    return (
        <>
            <Box sx={{ position: 'absolute', top: 1, right: 1 }}>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box>
                <Typography variant='h5'>
                    {t('openNatar.title', {
                        type: natarDetails.type == NATAR_TYPE.MAIN ? t('openNatar.main') : t('openNatar.secondary'),
                        name: natarDetails.name
                    })}
                </Typography>
            </Box>
            <Box mb={2} mt={2}>
                <Grid container spacing={3}>
                    <Grid size={6}>
                        <ColoredSideBox height='350px' >
                            <Box p={2}>
                                {fields.map(({ key, label }) =>
                                    natarDetails[key] ? (
                                        <Grid container key={key}>
                                            <Grid size={5}>
                                                <Typography fontWeight='bold'>{label}</Typography>
                                            </Grid>
                                            <Grid size={7}>
                                                <Typography>
                                                    {typeof natarDetails[key] === 'boolean'
                                                        ? t(natarDetails[key] ? 'openNatar.exists' : 'openNatar.doesntExist')
                                                        : String(natarDetails[key])}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    ) : null
                                )}
                            </Box>
                        </ColoredSideBox>
                    </Grid>
                    <Grid size={6}>
                        <SinglePointMap lat={natarDetails.lat} long={natarDetails.long} />
                        <AssignStaffToNatar
                            natar={natarDetails}
                            staffMembers={staffMembers}
                            setStaffMembers={setStaffMembers}
                            natarIdToNameMap={natarIdToNameMap}
                        />
                    </Grid>
                </Grid>
            </Box>
            <MainButton height={'40px'} onClick={handleSubmit}>{t('openNatar.openNatar')}</MainButton>
        </>
    );
};

export default AddNatar;