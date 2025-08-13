import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { Container, Typography, TextField, Box, IconButton, List, ListItem, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DestructionSitesMap from 'components/DestructionSitesComp/DestructionSitesMap'
import { DestructionSite } from 'components/Interfaces/DestructionSite';
import { formStyle, rtlStyle } from 'style/muiStyles';
import { MainButton, SecondaryButton } from 'components/atoms/Buttons';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { useNavigate } from 'react-router';
import { PAGES } from 'consts/pages.const';
import { ApprovePopup, LoadingPopup } from 'components/atoms/Popups';
import { getCasualtiesEstimate } from 'actions/arcgis/casualtiesEstimateActions';
import { addSiteAction, deleteSiteAction, getSites } from 'actions/sites/sitesActions';
import { generateRecommendation } from 'actions/generateRecommendation/recommendationAction';
import { waitForArcgisAuth } from 'actions/arcgis/waitForArcgisAuth';
import { getBuildingId } from 'actions/arcgis/getBuildingId';
import { errorHandler } from 'actions/errors/errorHandler';
import { getRecommendedNatars } from 'actions/natars/natarsActions';
import { Natar } from 'components/Interfaces/Natar';


const DestructionSites = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { earthquakeEvent } = useSelector((state: RootState) => state.appState);

    const [destructionSites, setDestructionSites] = useState<DestructionSite[]>([]);
    const [showRecommendationPopup, setShowRecommendationPopup] = useState(false);
    const [connectedToArcgis, setConnectedToArcgis] = useState<boolean | null>(null);
    const [earthquakeTimeIsDayTime, setEarthquakeTimeIsDayTime] = useState<boolean | null>(null);
    const [showLoadingPopup, setShowLoadingPopup] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState(t('destructionSites.connectingToMap'));
    const [streetNames, setStreetNames] = useState<string[]>([]);
    const [streetNumbers, setStreetNumbers] = useState<string[]>([]);
    const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
    const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
    const [recommendedNatars, setRecommendedNatars] = useState<Natar[]>([]);
    const [casualties, setCasualties] = useState('');
    const [casualtiesEstimate, setCasualtiesEstimate] = useState('');

    useEffect(() => {
        const isEarthquakeTimeIsDayTime = () => {
            if (!earthquakeEvent?.earthquakeTime) {
                navigate('/');
                return false; // Will not be used
            }
            const earthquakeHour = earthquakeEvent.earthquakeTime.getHours();
            if (earthquakeHour >= 7 && earthquakeHour < 19) {
                return true
            }
            return false;
        }
        setEarthquakeTimeIsDayTime(isEarthquakeTimeIsDayTime());
    });

    useEffect(() => {
        let isMounted = true;
    
        waitForArcgisAuth()
            .then((connected) => {
                if (!isMounted) return;
    
                if (connected) {
                    setConnectedToArcgis(true);
                } else {
                    setConnectedToArcgis(false);
                    errorHandler(dispatch, t('destructionSites.errorMsgs.serverGetError'));
                }
            })
            .catch((error) => {
                if (!isMounted) return;
                setConnectedToArcgis(false);
                errorHandler(dispatch, t('destructionSites.errorMsgs.serverGetError'), error);
            });
    
        return () => {
            isMounted = false;
        };
    }, []);
    
    useEffect(() => {
        const fetchSites = async () => {
            try {
                await getSites(setDestructionSites);
            } catch (error) {
                errorHandler(dispatch, t('destructionSites.errorMsgs.serverGetError'), error);
            }
        };

        fetchSites();
    }, []);

    useEffect(() => {
        if (streetNames && streetNames.length > 0) {
            setShowLoadingPopup(false);
        }
    }, [streetNames]);
    
    useEffect(() => {
        const updateCasualtiesEstimate = async () => {
            if (!selectedStreet || !selectedNumber || earthquakeTimeIsDayTime === null) return;
            const buildingId = await getCasualtiesEstimate(selectedStreet, selectedNumber, setCasualtiesEstimate, earthquakeTimeIsDayTime);
            setSelectedBuildingId(buildingId)
        }
        updateCasualtiesEstimate();
    }, [selectedStreet, selectedNumber, earthquakeTimeIsDayTime]);

    useEffect(() => {
        const fetchRecommendedNatar = () => {
            try {
                getRecommendedNatars(setRecommendedNatars);
            } catch (error) {
                errorHandler(dispatch, t('recommendedNatars.errorMsgs.serverGetError'));
            }
        };

        fetchRecommendedNatar();
    }, []);

    const handleApproveSitesChoice = async () => {
        setShowRecommendationPopup(false);
        setLoadingMessage(t('destructionSites.creatingRecommendation'));
        setShowLoadingPopup(true);

        try {
            await generateRecommendation();
        } catch (error) {
            setShowLoadingPopup(false);
            errorHandler(dispatch, t('destructionSites.errorMsgs.errorGettingRecommendation'), error);
            return;
        }
        navigate(`/${PAGES.RECOMMENDED_NATARS}`);
    };

    const handleShowRecommendation = () => {
        if (destructionSites.length === 0) {
            errorHandler(dispatch, t('destructionSites.errorMsgs.emptySites'));
            return;
        }
        setShowRecommendationPopup(true);
    };

    const addDestructionSite = async (site: DestructionSite) => {
        const isDuplicate = destructionSites.some(
            (s) => s.street === site.street && s.number === site.number
        );
    
        if (isDuplicate) {
            errorHandler(dispatch, t('destructionSites.errorMsgs.addressExists'));
            return false;
        }
        setDestructionSites([...destructionSites, site]);
        try {
            await addSiteAction(site);
        } catch (error) {
            errorHandler(dispatch, t('destructionSites.errorMsgs.serverGetError'), error);
            return false;
        }
        return true;
    };

    const addFormDestructionSite = async () => {
        if (!selectedStreet || !selectedNumber) return;

        if (!selectedBuildingId) {
            const fetchedBuildingId = await getBuildingId(selectedStreet, selectedNumber);
            if (!fetchedBuildingId) {
                return;
            }
            setSelectedBuildingId(fetchedBuildingId);
        }

        if (await addDestructionSite(
                {
                    buildingId: selectedBuildingId || 0,
                    street: selectedStreet,
                    number: selectedNumber,
                    casualties: Number(casualties ? casualties : casualtiesEstimate),
                }
            )) {
            setSelectedBuildingId(null)
            setSelectedStreet(null);
            setSelectedNumber('');
            setCasualties('');
            setCasualtiesEstimate('');
        }
    };

    const onSiteClick = (site: DestructionSite) => {
        setSelectedBuildingId(site.buildingId);
        setSelectedStreet(site.street);
        setSelectedNumber(site.number);
        setCasualties('');
    };

    const deleteDestructionSite = async (site: DestructionSite, index: number) => {
        try {
            await deleteSiteAction(site);
        } catch (error) {
            errorHandler(dispatch, t('destructionSites.errorMsgs.serverDeleteError'), error);
            return;
        }
        setDestructionSites(destructionSites.filter((_, i) => i !== index));
    };

  return (
    <Container>
        <Grid container spacing={3}>
            <Grid size={3.6}>
                <ColoredSideBox title={t('destructionSites.sites')} >
                    <List>
                        {destructionSites.map((site, index) => (
                            <ListItem
                                key={index}
                                disableGutters
                                secondaryAction={
                                    <IconButton edge="start" onClick={() => deleteDestructionSite(site, index)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={`${site.street} ${site.number}`}
                                    secondary={`${t('destructionSites.casualties')}: ${site.casualties}`}
                                    sx={{ textAlign: 'right' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </ColoredSideBox>
            </Grid>
            <Grid size={3.6}>
                <Typography variant='h6'>{t('destructionSites.newSite')}</Typography>
                <Box sx={formStyle}>
                    <Autocomplete
                        options={streetNames}
                        value={selectedStreet}
                        onChange={(_, newValue) => setSelectedStreet(newValue)}
                        fullWidth
                        renderInput={(params) => <TextField
                            {...params}
                            label={t('destructionSites.street')}
                            sx={rtlStyle}
                        />}
                    />
                    <Autocomplete
                        options={streetNumbers}
                        value={selectedNumber}
                        onChange={(_, newValue) => setSelectedNumber(newValue)}
                        fullWidth
                        renderInput={(params) => <TextField
                            {...params}
                            label={t('destructionSites.streetNumber')}
                            sx={rtlStyle}
                        />}
                    />
                    <TextField
                        label={t('destructionSites.numberOfCasualties')}
                        type='number'
                        value={casualties}
                        onChange={(e) => setCasualties(e.target.value)}
                        fullWidth
                        sx={rtlStyle}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography>{t('destructionSites.numberOfCasualtiesEst')}</Typography>
                        <Typography>{casualtiesEstimate ? casualtiesEstimate : '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <SecondaryButton variant='contained' color='primary' onClick={addFormDestructionSite}>
                            {t('buttons.add')}
                        </SecondaryButton>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    mt: 3,
                    gap: 1,
                }}>
                    {recommendedNatars.length !== 0 && 
                        <SecondaryButton 
                            variant='contained'
                            color='primary'
                            onClick={() => navigate(`/${PAGES.RECOMMENDED_NATARS}`)}
                        >
                            {t('destructionSites.showOldRecommendation')}
                        </SecondaryButton>
                    }
                    <MainButton height={'40px'} onClick={handleShowRecommendation}>
                        {t('destructionSites.getRecommendation')}
                    </MainButton>
                </Box>
            </Grid>
            <Grid size={4.8}>
                {connectedToArcgis && <DestructionSitesMap
                    destructionSites={destructionSites}
                    onClickDestructionSite={onSiteClick}
                    setStreetNames={setStreetNames}
                    setStreetNumbers={setStreetNumbers}
                    selectedStreet={selectedStreet}
                />}
            </Grid>
        </Grid>
        
        <ApprovePopup
            message={t('destructionSites.approveSites')}
            showPopup={showRecommendationPopup}
            setShowPopup={setShowRecommendationPopup}
            onApprove={handleApproveSitesChoice}
            onReject={() => setShowRecommendationPopup(false)}
        />

        <LoadingPopup loadingMessage={loadingMessage} showLoadingPopup={showLoadingPopup} />
    </Container>
  );
};

export default DestructionSites;