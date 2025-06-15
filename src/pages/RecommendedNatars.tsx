import React, { useEffect, useState } from 'react';
import { Box, Container, Dialog, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { MainButton, SecondaryButton } from 'components/atoms/Buttons';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { PAGES } from 'consts/pages.const';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { getRecommendedNatars } from 'actions/natars/natarsActions';
import { Natar } from 'components/Interfaces/Natar';
import { ErrorPopup } from 'components/atoms/Popups';
import AddIcon from '@mui/icons-material/Add';
import { mainButtonColor } from 'style/colors';
import AddNatar from './AddNatar';


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
    
    return (
        <Container sx={{ height: '100%' }}>
            <Grid container spacing={3}>
                <Grid size={4}>
                    <ColoredSideBox>
                        <List>
                            {recommendedNatars.map((natar, index) => (
                                <ListItem
                                    key={index}
                                    disableGutters
                                    secondaryAction={
                                        <IconButton edge="start" onClick={() => openNatar(natar)}>
                                            <AddIcon sx={{ color: mainButtonColor }} />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={`${natar.name}`}
                                        sx={{ textAlign: 'right' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </ColoredSideBox>
                </Grid>
                <Grid size={8}>
                    <Box>
                        <Typography variant='h4'>{t('recommendedNatars.title')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', width: '100%', height: '90%', gap: 2 }}>
                        <SecondaryButton onClick={handleAddSite}>{t('recommendedNatars.addDestructionSite')}</SecondaryButton>
                        <MainButton height={'40px'} onClick={handleSubmit}>{t('buttons.submit')}</MainButton>
                    </Box>
                </Grid>
            </Grid>

            <Dialog open={isNatarModalOpen} onClose={closeModal} fullWidth maxWidth='md'>
                {selectedNatar && <AddNatar natarDetails={selectedNatar} onClose={closeModal} />}
            </Dialog>
            
            <ErrorPopup errorMessage={errorMessage} showErrorPopup={showErrorPopup} setShowErrorPopup={setShowErrorPopup} />
        </Container>
    );
};

export default RecommendedNatars;