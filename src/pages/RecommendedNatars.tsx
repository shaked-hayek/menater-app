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
import { LoadingPopup } from 'components/atoms/Popups';
import AddNatar from './AddNatar';
import MultiPointMap from 'actions/arcgis/MultiPointMap';
import NatarNestedList from 'components/natars/NatarNestedList';
import { NATAR_TYPE } from 'consts/natarType.const';
import { createEventSummaryAction } from 'actions/events/eventSummaryActions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { errorHandler } from 'actions/errors/errorHandler';
import { getSitesCasualtiesSum } from 'actions/sites/sitesActions';
import { computeNatarCapacity, computeOptionalNatarCapacity } from 'utils';

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
    const dispatch = useDispatch();

    const [recommendedNatars, setRecommendedNatars] = useState<Natar[]>([]);
    const [natarIdToNameMap, setNatarIdToNameMap] = useState<Record<number, string>>({});
    const [selectedNatar, setSelectedNatar] = useState<Natar | null>(null);
    const [totalCasualties, setTotalCasualties] = useState<number>();
    const [isNatarModalOpen, setIsNatarModalOpen] = useState(false);
    const [showLoadingPopup, setShowLoadingPopup] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState(t('recommendedNatars.loading'));
    const { earthquakeEvent } = useSelector((state: RootState) => state.appState);

    useEffect(() => {
        const fetchNatars = async () => {
          try {
            const natarsResult = await getRecommendedNatars(setRecommendedNatars);
            setShowLoadingPopup(false);

            // Generate map from the fetched natars
            setNatarIdToNameMap(prevMap =>
                Object.fromEntries(
                    natarsResult.map(natar => [natar.id, natar.name])
                )
            );

          } catch (error) {
            errorHandler(dispatch, t('recommendedNatars.errorMsgs.serverGetError'), error);
          }
        };
        
        fetchNatars();
      }, []);

    useEffect(() => {
        const fetchTotalCasualties = async () => {
            try {
                const casualties = await getSitesCasualtiesSum();
                setTotalCasualties(casualties);
            } catch (error) {
                errorHandler(dispatch, t('recommendedNatars.errorMsgs.serverGetError'), error);
            }
        };

        fetchTotalCasualties();
    }, []);

    const handleAddSite = () => {
        navigate(`/${PAGES.DESTRUCTION_SITES}`);
    };

    const handleSubmit = async () => {
        if (earthquakeEvent?.id) {
            setLoadingMessage(t('recommendedNatars.loadingSubmit'));
            setShowLoadingPopup(true);
            await createEventSummaryAction(earthquakeEvent.id);
            navigate('/', { state: { showSummaryForEventId: earthquakeEvent.id } });
        } else {
            navigate(`/`);
        }
    };

    const openNatar = (natar: Natar) => {
        if (!natar) {
            return;
        }
        if (natar.type == NATAR_TYPE.SECONDARY) {
            const fatherNatar = recommendedNatars.find(n => n.id === natar.fatherNatar);

            if (!fatherNatar) {
                errorHandler(dispatch, t('recommendedNatars.errorMsgs.fatherNotFound'));
                return;
            }

            if (!fatherNatar.wasOpened) {
                errorHandler(dispatch, t('recommendedNatars.errorMsgs.fatherNotOpened'));
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
                    <Box>
                        <Typography variant='body2'>
                            {t('recommendedNatars.casualtiesAndCapacity', {
                                totalCasualties,
                                capacity: computeNatarCapacity(recommendedNatars),
                                optionalCapacity: computeOptionalNatarCapacity(recommendedNatars),
                            })}
                        </Typography>
                    </Box>
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
                    {selectedNatar && 
                        <AddNatar
                            natarDetails={selectedNatar}
                            onClose={closeModal}
                            onMarkAsOpened={markNatarAsOpen}
                            natarIdToNameMap={natarIdToNameMap}
                        />
                    }
                </Box>
            </Modal>
            
            <LoadingPopup loadingMessage={loadingMessage} showLoadingPopup={showLoadingPopup} />
        </Container>
    );
};

export default RecommendedNatars;