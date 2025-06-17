import React, { useEffect, useState } from 'react';
import { Box, Container, Modal, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { MainButton, SecondaryButton } from 'components/atoms/Buttons';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { PAGES } from 'consts/pages.const';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { getRecommendedNatars } from 'actions/natars/natarsActions';
import { Natar } from 'components/Interfaces/Natar';
import { ErrorPopup } from 'components/atoms/Popups';
import AddNatar from './AddNatar';
import MultiPointMap from 'actions/arcgis/MultiPointMap';
import NatarNestedList from 'components/NatarNestedList';

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

const RecommendedNatars = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [recommendedNatars, setRecommendedNatars] = useState<Natar[]>([]);
    const [selectedNatar, setSelectedNatar] = useState<Natar | null>(null);
    const [isNatarModalOpen, setIsNatarModalOpen] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchNatars = async () => {
          try {
            await getRecommendedNatars(setRecommendedNatars);
          } catch (error) {
            setErrorMessage(t('recommendedNatars.errorMsgs.serverGetError'));
            setShowErrorPopup(true);
          }
        };
        
        fetchNatars();
      }, []);

    const handleAddSite = () => {
        navigate(`/${PAGES.DESTRUCTION_SITES}`);
    };

    const handleSubmit = () => {
        navigate(`/`);
    };

    const openNatar = (natar: Natar) => {
        if (natar) {
            setSelectedNatar(natar);
            setIsNatarModalOpen(true);
        }
    }

    const closeModal = () => {
        setIsNatarModalOpen(false);
        setSelectedNatar(null);
    };

    const markNatarAsOpen = (id: number) => {
        setRecommendedNatars(prev =>
            prev.map(natar =>
                natar.id === id ? { ...natar, wasOpened: true } : natar
            )
        );
    };
    
    return (
        <Container sx={{ height: '100%' }}>
            <Grid container spacing={3}>
                <Grid size={4}>
                    <ColoredSideBox disableOverflowX>
                        <NatarNestedList recommendedNatars={recommendedNatars} openNatar={openNatar} />
                    </ColoredSideBox>
                </Grid>
                <Grid size={8}>
                    <Box mb={2}>
                        <Typography variant='h4'>{t('recommendedNatars.title')}</Typography>
                    </Box>
                    <MultiPointMap natars={recommendedNatars} />
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        width: '100%',
                        gap: 2,
                        mt: 2
                    }}>
                        <SecondaryButton onClick={handleAddSite}>{t('recommendedNatars.addDestructionSite')}</SecondaryButton>
                        <MainButton height={'40px'} onClick={handleSubmit}>{t('buttons.submit')}</MainButton>
                    </Box>
                </Grid>
            </Grid>

            <Modal open={isNatarModalOpen} onClose={closeModal}>
                <Box sx={modalStyle}>
                    {selectedNatar && <AddNatar natarDetails={selectedNatar} onClose={closeModal} onMarkAsOpened={markNatarAsOpen} />}
                </Box>
            </Modal>
            
            <ErrorPopup errorMessage={errorMessage} showErrorPopup={showErrorPopup} setShowErrorPopup={setShowErrorPopup} />
        </Container>
    );
};

export default RecommendedNatars;