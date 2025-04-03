import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Dialog, DialogTitle, DialogActions, IconButton, List, ListItem, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MapComponent, { DestructionSite } from 'components/DestractionSitesComp/DestructionSitesMap';
import { formStyle, rtlStyle } from 'style/muiStyles';
import { MainButton, SecondaryButton } from 'components/atoms/Buttons';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { useNavigate } from 'react-router';
import { PAGES } from 'consts/pages.const';
import { ApprovePopup, ErrorPopup } from 'components/atoms/Popups';


const DestructionSites = () => {
  const [destructionSites, setDestructionSites] = useState<DestructionSite[]>([]);
  const [showEmptyPopup, setShowEmptyPopup] = useState(false);
  const [showRecommendationPopup, setShowRecommendationPopup] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [streetNames, setStreetNames] = useState<string[]>(['ארלוזורוב']); //TODO: remove street
  const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
  const [siteNumber, setSiteNumber] = useState('');
  const [casualties, setCasualties] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

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
  
  const addDestructionSite = () => {
    if (!selectedStreet || !siteNumber) return;

    const isDuplicate = destructionSites.some(
      (site) => site.street === selectedStreet && site.number === siteNumber
    );

    if (isDuplicate) {
      setShowDuplicatePopup(true);
    } else {
      setDestructionSites([...destructionSites, { street: selectedStreet, number: siteNumber, casualties }]);
      setSelectedStreet(null);
      setSiteNumber('');
      setCasualties('');
    }
  };

  const deleteDestructionSite = (index: number) => {
    setDestructionSites(destructionSites.filter((_, i) => i !== index));
  };

  return (
    <Container>
        <Typography variant='h4' gutterBottom>{t('destructionSites.input')}</Typography>
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
                    <TextField
                        label={t('destructionSites.streetNumber')}
                        type='number'
                        value={siteNumber}
                        onChange={(e) => setSiteNumber(e.target.value)}
                        fullWidth
                        sx={rtlStyle}
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
                        <Typography>30</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <SecondaryButton variant='contained' color='primary' onClick={addDestructionSite}>
                            {t('buttons.add')}
                        </SecondaryButton>
                    </Box>
                </Box>
            </Grid>
            <Grid size={4.8}>
                <MapComponent
                    destructionSites={destructionSites}
                    addDestructionSite={addDestructionSite}
                    removeDestructionSite={(site: DestructionSite) =>
                    setDestructionSites((prevSites) => prevSites.filter((s) => !(s.street === site.street && s.number === site.number)))
                    }
                    setStreetNames={setStreetNames}
                />
            </Grid>
        </Grid>
        <Box display='flex' justifyContent='center' mt={3}>
            <MainButton height={'40px'} onClick={handleShowRecommendation}>
                {t('destructionSites.getRecommendation')}
            </MainButton>
        </Box>

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