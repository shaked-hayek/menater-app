import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { NATAR_TYPE } from 'consts/natarType.const';
import { useTranslation } from 'react-i18next';

interface NatarDetails {
    id: number;
    name: string;
    type: NATAR_TYPE;
    address?: string;
    capacity?: number;
    equipmentLocation?: string;
    lastUpdateDate?: string;
    // TODO
}

interface AddNatarProps {
    natarDetails: NatarDetails;
}

const AddNatar = ({natarDetails}: AddNatarProps) => {
    const { t } = useTranslation();
    
    return (
        <>
            <Box>
                <Typography variant='h4'>{t('openNatar.title', { type: natarDetails.type, name: natarDetails.name})}</Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid size={6}>
                    <ColoredSideBox>

                    </ColoredSideBox>
                </Grid>
                <Grid size={6}>
                </Grid>
            </Grid>
        </>
    );
};

export default AddNatar;