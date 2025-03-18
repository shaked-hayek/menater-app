import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Dialog, DialogTitle, DialogActions, IconButton, List, ListItem, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MapComponent, { DestructionSite } from 'components/DestractionSitesComp/DestructionSitesMap';
import { formStyle, rtlStyle } from 'style/muiStyles';
import { MainButton, SeconderyButton } from 'components/atoms/Buttons';
import { secondaryBackgroundColor } from 'style/colors';



const DestructionSites = () => {
  const [destructionSites, setDestructionSites] = useState<DestructionSite[]>([]);
  const [showRecommendationPopup, setShowRecommendationPopup] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [streetNames, setStreetNames] = useState<string[]>([]);
  const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
  const [siteNumber, setSiteNumber] = useState('');
  const [casualties, setCasualties] = useState('');
  const { t } = useTranslation();

  const handleCloseRecommendation = () => setShowRecommendationPopup(false);
  const handleShowRecommendation = () => setShowRecommendationPopup(true);
  const handleCloseDuplicatePopup = () => setShowDuplicatePopup(false);

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
        <Typography variant='h4' gutterBottom>{t('DestructionSites.input')}</Typography>
        <Grid container spacing={3}>
            <Grid size={3.6}>
                <Box sx={{ bgcolor: secondaryBackgroundColor, height: '100%', borderRadius: '10%', p: 2 }}>
                    <Typography variant='h6'>{t('DestructionSites.sites')}</Typography>
                    <List>
                        {destructionSites.map((site, index) => (
                        <ListItem key={index} secondaryAction={
                            <IconButton edge='end' onClick={() => deleteDestructionSite(index)}>
                            <DeleteIcon color='error' />
                            </IconButton>
                        }>
                            <ListItemText primary={`${site.street} ${site.number}`} secondary={`${t('DestructionSites.casualties')}: ${site.casualties}`} />
                        </ListItem>
                        ))}
                    </List>
                </Box>
            </Grid>
            <Grid size={3.6}>
                <Typography variant='h6'>{t('DestructionSites.newSite')}</Typography>
                <Box sx={formStyle}>
                    <Autocomplete
                        options={streetNames}
                        value={selectedStreet}
                        onChange={(_, newValue) => setSelectedStreet(newValue)}
                        fullWidth
                        renderInput={(params) => <TextField
                            {...params}
                            label={t('DestructionSites.street')}
                            sx={rtlStyle}
                        />}
                    />
                    <TextField
                        label={t('DestructionSites.streetNumber')}
                        type='number'
                        value={siteNumber}
                        onChange={(e) => setSiteNumber(e.target.value)}
                        fullWidth
                        sx={rtlStyle}
                    />
                    <TextField
                        label={t('DestructionSites.numberOfCasualties')}
                        type='number'
                        value={casualties}
                        onChange={(e) => setCasualties(e.target.value)}
                        fullWidth
                        sx={rtlStyle}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <SeconderyButton variant='contained' color='primary' onClick={addDestructionSite}>
                            {t('buttons.add')}
                        </SeconderyButton>
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
                {t('DestructionSites.getRecommendation')}
            </MainButton>
        </Box>
        <Dialog open={showRecommendationPopup} onClose={handleCloseRecommendation}>
            <DialogTitle>{t('DestructionSites.approveSites')}</DialogTitle>
            <DialogActions>
            <Button onClick={handleCloseRecommendation} color='error'>{t('buttons.edit')}</Button>
            <Button onClick={handleCloseRecommendation} color='primary'>{t('buttons.submit')}</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={showDuplicatePopup} onClose={handleCloseDuplicatePopup}>
            <DialogTitle>{t('DestructionSites.addressExists')}</DialogTitle>
            <DialogActions>
            <Button onClick={handleCloseDuplicatePopup} color='primary'>{t('buttons.submit')}</Button>
            </DialogActions>
        </Dialog>
    </Container>
  );
};

export default DestructionSites;