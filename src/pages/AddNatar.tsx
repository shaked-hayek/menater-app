import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Natar } from 'components/Interfaces/Natar';
import AssignStaffToNatar from 'components/Staff/AssignStaffToNatar';
import { MainButton } from 'components/atoms/Buttons';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { NATAR_TYPE } from 'consts/natarType.const';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import SinglePointMap from 'actions/arcgis/SinglePointMap';


interface AddNatarProps {
    natarDetails: Natar;
    onClose: () => void;
    onMarkAsOpened: (id: number) => void;
}

const AddNatar = ({natarDetails, onClose, onMarkAsOpened}: AddNatarProps) => {
    const { t } = useTranslation();

    const fields: { key: keyof Natar; label: string }[] = [
        { key: 'id', label: t('openNatar.natarDetails.id') },
        { key: 'address', label: t('openNatar.natarDetails.address') },
        { key: 'capacity', label: t('openNatar.natarDetails.capacity') },
        { key: 'equipmentLocation', label: t('openNatar.natarDetails.equipmentLocation') },
        { key: 'lastUpdateDate', label: t('openNatar.natarDetails.lastUpdateDate') },
        { key: 'nature', label: t('openNatar.natarDetails.nature') },
        { key: 'terrainType', label: t('openNatar.natarDetails.terrainType') },
        { key: 'carAccess', label: t('openNatar.natarDetails.vehicleApproach') },
        { key: 'gasStationNear', label: t('openNatar.natarDetails.gasStationNear') },
        { key: 'shade', label: t('openNatar.natarDetails.shade') },
        { key: 'availableFacilities', label: t('openNatar.natarDetails.availableFacilities') },
    ];

    const handleSubmit = () => {
        // todo - check staff
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
                                                        ? t(natarDetails[key] ? t('openNatar.exists') : 'general.doesntExist')
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
                        <AssignStaffToNatar natar={natarDetails} />
                    </Grid>
                </Grid>
            </Box>
            <MainButton height={'40px'} onClick={handleSubmit}>{t('openNatar.openNatar')}</MainButton>
        </>
    );
};

export default AddNatar;