import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Modal, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import { EmergencyButton, MainButton, SeconderyButton, TrialButton } from 'components/atoms/Buttons';
import { setMode } from 'store/store';
import { MODE } from 'consts/mode.const';
import { PAGES } from 'consts/pages.const';


const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: "center",
  };


const StartPage = () => {
    const [showNewEvent, setShowNewEvent] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShowNewEvent(false);
    const handleEventChoice = (mode: MODE) => {
        dispatch(setMode(mode));
        handleClose();
        navigate(`/${PAGES.NEW_EVENT}`)
    };
    const handleShow = () => setShowNewEvent(true);
    
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const logo = require("../assets/Logo.png");

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <img src={logo} alt='Logo' width={150} />
                <Typography variant='h4'>{t('startPage.title')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box sx={{ p: 2, m: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <SeconderyButton>
                        {t('startPage.eventsHistory')}
                    </SeconderyButton>
                    <SeconderyButton>
                        {t('startPage.manageNatars')}
                    </SeconderyButton>
                    <SeconderyButton onClick={() => navigate(`/${PAGES.MANAGE_STAFF}`)}>
                        {t('startPage.manageStaff')}
                    </SeconderyButton>
                    <SeconderyButton>
                        {t('startPage.synchronize')}
                    </SeconderyButton>
                    <SeconderyButton>
                        {t('startPage.settings')}
                    </SeconderyButton>
                </Box>
                <MainButton onClick={handleShow}>
                    {t('startPage.openEvent')}
                </MainButton>
            </Box>
            <Modal open={showNewEvent} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant='h5'>{t('startPage.chooseEventType')}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly'}}>
                        <EmergencyButton onClick={() => handleEventChoice(MODE.EMERGENCY)}>
                            {t('startPage.emergencyEvent')}
                        </EmergencyButton>
                        <TrialButton onClick={() => handleEventChoice(MODE.TRIAL)}>
                            {t('startPage.trialEvent')}
                        </TrialButton>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default StartPage;