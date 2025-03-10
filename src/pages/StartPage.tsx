import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { MainButton, SeconderyButton } from 'components/atoms/Buttons';
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from 'store/store';
import { MODE } from 'consts/mode.const';
import { Box, Modal, Typography } from '@mui/material';

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
        navigate('/newEvent')
    };
    const handleShow = () => setShowNewEvent(true);
    
    const { t } = useTranslation();
    const dispatch = useDispatch();

    return (
        <>
            <Container>
                <h1>{t('startPage.title')}</h1>
            </Container>
            <Container className='d-flex justify-content-center align-items-center vh-100'>
                <div className='d-flex flex-column me-5'>
                <SeconderyButton>
                    {t('startPage.eventsHistory')}
                </SeconderyButton>
                <SeconderyButton>
                    {t('startPage.manageNatars')}
                </SeconderyButton>
                <SeconderyButton>
                    {t('startPage.manageStaff')}
                </SeconderyButton>
                <SeconderyButton>
                    {t('startPage.synchronize')}
                </SeconderyButton>
                <SeconderyButton>
                    {t('startPage.settings')}
                </SeconderyButton>
                </div>
                <MainButton onClick={handleShow}>
                    {t('startPage.openEvent')}
                </MainButton>
            </Container>
            <Modal open={showNewEvent} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant='h5'>{t('startPage.chooseEventType')}</Typography>
                    <Button onClick={() => handleEventChoice(MODE.EMERGENCY)}>
                        {t('startPage.emergencyEvent')}
                    </Button>
                    <Button onClick={() => handleEventChoice(MODE.TRIAL)}>
                        {t('startPage.trialEvent')}
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default StartPage;