import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { MainButton, SeconderyButton } from 'components/atoms/Buttons';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { PAGES } from 'consts/pages.const';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const RecommendedNatars = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleAddSite = () => {
        // navigate(`/${PAGES.DESTRUCATION_SITES}`);
    };

    const handleSubmit = () => {
        navigate(`/${PAGES.DESTRUCATION_SITES}`);
    };
    
    return (
        <Container sx={{ height: '100%' }}>
            <Box>
                <Typography variant='h4'>{t('recommendedNatars.title')}</Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid size={4}>
                    <ColoredSideBox>
                    
                    </ColoredSideBox>
                </Grid>
                <Grid size={8}></Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 2 }}>
                <SeconderyButton onClick={handleAddSite}>{t('recommendedNatars.addDestructionSite')}</SeconderyButton>
                <MainButton height={'40px'} onClick={handleSubmit}>{t('buttons.submit')}</MainButton>
            </Box>
        </Container>
    );
};

export default RecommendedNatars;