import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Modal, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import { EmergencyButton, MainButton, SecondaryButton, TrialButton } from 'components/atoms/Buttons';
import { setMode } from 'store/store';
import { MODE } from 'consts/mode.const';
import { PAGES } from 'consts/pages.const';
import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';
import { getEventsAction } from 'actions/events/eventsActions';
import { ErrorPopup, LoadingPopup } from 'components/atoms/Popups';
import { setEventDataForSystem } from 'utils';
import { generateClosestNatarsAction } from 'actions/closestNatarsAction/closestNatarsAction';


const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: 'center',
};

const buttonsStyle = {
    p: 2,
    m: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
}


const StartPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [showNewEvent, setShowNewEvent] = useState(false);
    const [oldEvents, setOldEvents] = useState<EarthquakeEvent[]>([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoadingPopup, setShowLoadingPopup] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
          try {
            await getEventsAction(setOldEvents);
          } catch (error) {
            setErrorMessage(t('startPage.errorMsgs.serverGetError'));
            setShowErrorPopup(true);
          }
        };
        
        fetchEvents();
      }, []);

    const handleClose = () => setShowNewEvent(false);
    const handleEventChoice = (mode: MODE) => {
        dispatch(setMode(mode));
        handleClose();
        navigate(`/${PAGES.NEW_EVENT}`)
    };
    const handleShow = () => setShowNewEvent(true);

    const onOpenExistingEvent = () => {
        // TODO: add option to open events other then last one
        setEventDataForSystem(oldEvents[0], dispatch);
        navigate(`/${PAGES.DESTRUCTION_SITES}`);
    }

    const onInitialize = async() => {
        setLoadingMessage(t('startPage.initializing'))
        setShowLoadingPopup(true);
        try {
            await generateClosestNatarsAction();
        } catch (error) {
            setErrorMessage(t('startPage.errorMsgs.serverGetError'));
            setShowLoadingPopup(false);
            setShowErrorPopup(true);
            return;
        }
    };

    const logo = require('../assets/Logo.png');

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <img src={logo} alt='Logo' width={150} />
                <Typography variant='h4'>{t('startPage.title')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box sx={buttonsStyle}>
                    <SecondaryButton>
                        {t('startPage.eventsHistory')}
                    </SecondaryButton>
                    <SecondaryButton onClick={() => navigate(`/${PAGES.MANAGE_NATARS}`)}>
                        {t('startPage.manageNatars')}
                    </SecondaryButton>
                    <SecondaryButton onClick={() => navigate(`/${PAGES.MANAGE_STAFF}`)}>
                        {t('startPage.manageStaffButton')}
                    </SecondaryButton>
                    <SecondaryButton onClick={onInitialize}>
                        {t('startPage.initialize')}
                    </SecondaryButton>
                    <SecondaryButton>
                        {t('startPage.settings')}
                    </SecondaryButton>
                </Box>
                <Box sx={buttonsStyle}>
                    {oldEvents.length !== 0 &&
                        <MainButton onClick={onOpenExistingEvent}>
                            {t('startPage.openExistingEvent')}
                        </MainButton>
                    }
                    <MainButton onClick={handleShow}>
                        {t('startPage.openNewEvent')}
                    </MainButton>
                </Box>
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

            <ErrorPopup errorMessage={errorMessage} showErrorPopup={showErrorPopup} setShowErrorPopup={setShowErrorPopup} />
            
            <LoadingPopup loadingMessage={loadingMessage} showLoadingPopup={showLoadingPopup} />
        </>
    );
};

export default StartPage;