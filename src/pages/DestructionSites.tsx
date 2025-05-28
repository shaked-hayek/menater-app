import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { Container, Typography, TextField, Box, IconButton, List, ListItem, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DestructionSitesMap, { DestructionSite } from 'components/DestructionSitesComp/DestructionSitesMap'
import { formStyle, rtlStyle } from 'style/muiStyles';
import { MainButton, SecondaryButton } from 'components/atoms/Buttons';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { useNavigate } from 'react-router';
import { PAGES } from 'consts/pages.const';
import { ApprovePopup, ErrorPopup } from 'components/atoms/Popups';
import { getCasualtiesEstimate } from 'actions/arcgis/casualtiesEstimateActions';


const DestructionSites = () => {
    const [destructionSites, setDestructionSites] = useState<DestructionSite[]>([]);
    const [showEmptyPopup, setShowEmptyPopup] = useState(false);
    const [showRecommendationPopup, setShowRecommendationPopup] = useState(false);
    const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
    const [streetNames, setStreetNames] = useState<string[]>([]);
    const [streetNumbers, setStreetNumbers] = useState<string[]>([]);
    const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
    const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
    const [casualties, setCasualties] = useState('');
    const [casualtiesEstimate, setCasualtiesEstimate] = useState('');
    
    const { t } = useTranslation();
    const navigate = useNavigate();

    const isEarthquakeTimeIsDayTime = () => {
        const { earthquakeTime } = useSelector((state: RootState) => state.appState);
        const earthquakeHour = earthquakeTime!.getHours();
        if (earthquakeHour >= 7 && earthquakeHour < 19) {
            return true
        }
        return false;
    }
    const earthquakeTimeIsDayTime = isEarthquakeTimeIsDayTime();


    const handleApproveSitesChoice = () => {
            setShowRecommendationPopup(false);
            // TODO: get recommendation
            navigate(`/${PAGES.RECOMMENDED_NATARS}`);
        };

    const handleShowRecommendation = () => {
        if (destructionSites.length === 0) {
            setShowEmptyPopup(true);
            return;
        }
        setShowRecommendationPopup(true);
    };

    const addDestructionSite = (site: DestructionSite) => {
        const isDuplicate = destructionSites.some(
            (s) => s.street === site.street && s.number === site.number
        );
    
        if (isDuplicate) {
            setShowDuplicatePopup(true);
            return false;
        }
        setDestructionSites([...destructionSites, site]);
        return true;
    };

    const addFormDestructionSite = () => {
        if (!selectedStreet || !selectedNumber) return;

        if (addDestructionSite(
                {
                    street: selectedStreet,
                    number: selectedNumber,
                    casualties: Number(casualties ? casualties : casualtiesEstimate),
                }
            )) {
            setSelectedStreet(null);
            setSelectedNumber('');
            setCasualties('');
            setCasualtiesEstimate('');
        }
    };

    const onSiteClick = (site: DestructionSite) => {
        setSelectedStreet(site.street);
        setSelectedNumber(site.number);
        setCasualties('');
    };

    const deleteDestructionSite = (index: number) => {
        setDestructionSites(destructionSites.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const updateCasualtiesEstimate = () => {
            if (!selectedStreet || !selectedNumber) return;
            getCasualtiesEstimate(selectedStreet, selectedNumber, setCasualtiesEstimate, earthquakeTimeIsDayTime);
        }
        updateCasualtiesEstimate();
    }, [selectedStreet, selectedNumber]);

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
                                    <IconButton edge="start" onClick={() => deleteDestructionSite(index)}>
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
                    alignItems: 'flex-end',
                    mt: 3,
                }}>
                    <MainButton height={'40px'} onClick={handleShowRecommendation}>
                        {t('destructionSites.getRecommendation')}
                    </MainButton>
                </Box>
            </Grid>
            <Grid size={4.8}>
                <DestructionSitesMap
                    destructionSites={destructionSites}
                    onClickDestructionSite={onSiteClick}
                    setStreetNames={setStreetNames}
                    setStreetNumbers={setStreetNumbers}
                    selectedStreet={selectedStreet}
                />
            </Grid>
        </Grid>
        

        <ErrorPopup errorMessage={t('destructionSites.emptySites')} showErrorPopup={showEmptyPopup} setShowErrorPopup={setShowEmptyPopup} />
        <ErrorPopup errorMessage={t('destructionSites.addressExists')} showErrorPopup={showDuplicatePopup} setShowErrorPopup={setShowDuplicatePopup} />
        <ApprovePopup
            message={t('destructionSites.approveSites')}
            showPopup={showRecommendationPopup}
            setShowPopup={setShowRecommendationPopup}
            onApprove={handleApproveSitesChoice}
            onReject={() => setShowRecommendationPopup(false)}
        />
    </Container>
  );
};

export default DestructionSites;