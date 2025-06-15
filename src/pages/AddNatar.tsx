import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Natar } from 'components/Interfaces/Natar';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { NATAR_TYPE } from 'consts/natarType.const';
import { useTranslation } from 'react-i18next';


interface AddNatarProps {
    natarDetails: Natar;
    onClose: () => void;
}

const AddNatar = ({natarDetails, onClose}: AddNatarProps) => {
    const { t } = useTranslation();

    const fields: { key: keyof Natar; label: string }[] = [
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
    
    return (
        <>
            <Box>
                <Typography variant='h5'>
                    {t('openNatar.title', {
                        type: natarDetails.type == NATAR_TYPE.MAIN ? t('openNatar.main') : t('openNatar.secondary'),
                        name: natarDetails.name
                    })}
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid size={6}>
                    <ColoredSideBox>
                        {fields.map(({ key, label }) =>
                            natarDetails[key] ? (
                                <Box key={key} sx={{ display: 'flex', gap: 1 }}>
                                    <Typography fontWeight='bold'>{label}:</Typography>
                                    <Typography>
                                        {typeof natarDetails[key] === 'boolean'
                                            ? t(natarDetails[key] ? t('openNatar.exists') : 'general.doesntExist')
                                            : String(natarDetails[key])}
                                    </Typography>
                                </Box>
                            ) : null
                        )}
                    </ColoredSideBox>
                </Grid>
                <Grid size={6}>
                </Grid>
            </Grid>
        </>
    );
};

export default AddNatar;