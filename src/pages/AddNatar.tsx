import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Natar } from 'components/Interfaces/Natar';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { NATAR_TYPE } from 'consts/natarType.const';
import { useTranslation } from 'react-i18next';


interface AddNatarProps {
    natarDetails: Natar;
}

const AddNatar = ({natarDetails}: AddNatarProps) => {
    const { t } = useTranslation();

    const fields: { key: keyof Natar; label: string }[] = [
        { key: 'address', label: t('natarDetails.address') },
        { key: 'capacity', label: t('natarDetails.capacity') },
        { key: 'equipmentLocation', label: t('natarDetails.equipmentLocation') },
        { key: 'lastUpdateDate', label: t('natarDetails.lastUpdateDate') },
        { key: 'nature', label: t('natarDetails.nature') },
        { key: 'terrainType', label: t('natarDetails.terrainType') },
        { key: 'vehicleApproach', label: t('natarDetails.vehicleApproach') },
        { key: 'gasStationNear', label: t('natarDetails.gasStationNear') },
        { key: 'shade', label: t('natarDetails.shade') },
        { key: 'availableFacilities', label: t('natarDetails.availableFacilities') },
    ];
    
    return (
        <>
            <Box>
                <Typography variant='h4'>{t('openNatar.title', { type: natarDetails.type, name: natarDetails.name})}</Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid size={6}>
                    <ColoredSideBox>
                        {fields.map(({ key, label }) =>
                            natarDetails[key] ? (
                                <Box key={key} sx={{ display: 'flex', gap: 1 }}>
                                    <Typography fontWeight='bold'>{label}:</Typography>
                                    <Typography>{String(natarDetails[key])}</Typography>
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