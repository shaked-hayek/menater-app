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
import { ErrorPopup, LoadingPopup } from 'components/atoms/Popups';
import AddNatar from './AddNatar';
import MultiPointMap from 'actions/arcgis/MultiPointMap';
import NatarNestedList from 'components/natars/NatarNestedList';
import { NATAR_TYPE } from 'consts/natarType.const';
import { createEventSummaryAction } from 'actions/events/eventSummaryActions';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';

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
    const [showLoadingPopup, setShowLoadingPopup] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState(t('recommendedNatars.loading'));
    const [errorMessage, setErrorMessage] = useState('');
    const { earthquakeEvent } = useSelector((state: RootState) => state.appState);

    useEffect(() => {
        const fetchNatars = async () => {
          try {
            await getRecommendedNatars(setRecommendedNatars);
            setShowLoadingPopup(false);
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
        if (earthquakeEvent?.id) {
            createEventSummaryAction(earthquakeEvent.id);
        }
        // todo: show summary
        navigate(`/`);
    };

    const openNatar = (natar: Natar) => {
        if (!natar) {
            return;
        }
        if (natar.type == NATAR_TYPE.SECONDARY) {
            const fatherNatar = recommendedNatars.find(n => n.id === natar.fatherNatar);

            if (!fatherNatar) {
                setErrorMessage(t('recommendedNatars.errorMsgs.fatherNotFound'));
                setShowErrorPopup(true);
                return;
            }

            if (!fatherNatar.wasOpened) {
                setErrorMessage(t('recommendedNatars.errorMsgs.fatherNotOpened'));
                setShowErrorPopup(true);
                return;
            }
        }

        setSelectedNatar(natar);
        setIsNatarModalOpen(true);
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
            <LoadingPopup loadingMessage={loadingMessage} showLoadingPopup={showLoadingPopup} />
        </Container>
    );
};

export default RecommendedNatars;