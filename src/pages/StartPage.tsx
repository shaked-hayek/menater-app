import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { EmergencyButton, MainButton, SecondaryButton, TrialButton } from 'components/atoms/Buttons';
import { RootState, setDisplayEventId, setEarthquakeEvent, setMode } from 'store/store';
import { MODE } from 'consts/mode.const';
import { PAGES } from 'consts/pages.const';
import { LoadingPopup } from 'components/atoms/Popups';
import { clearEventDataAction, getEventSummaryAction } from 'actions/events/eventSummaryActions';
import EventSummaryModal, { eventSummaryModalStyle } from 'components/Events/EventSummaryModal';
import { errorHandler } from 'actions/errors/errorHandler';
import { emergencyOptionalButtonColor, trialOptionalButtonColor } from 'style/colors';


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
    const location = useLocation();
    const { earthquakeEvent, mode } = useSelector((state: RootState) => state.appState);

    const [showNewEvent, setShowNewEvent] = useState(false);
    const [showLoadingPopup, setShowLoadingPopup] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [summaryData, setSummaryData] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummaryIfRequested = async () => {
            const eventIdForSummary = location.state?.showSummaryForEventId;

            if (!eventIdForSummary) return;
            navigate('.', { replace: true, state: null }); // Clear the state

            try {
                setLoadingMessage('');
                setShowLoadingPopup(true);
                const summary = await getEventSummaryAction(eventIdForSummary);
                if (summary) {
                    setSummaryData(summary);
                    setShowModal(true);
                }
            } catch (error) {
                errorHandler(dispatch, t('startPage.errorMsgs.serverGetError'), error);
            } finally {
                setShowLoadingPopup(false);
            }
        };

        fetchSummaryIfRequested();
    }, [location.state]);

    const handleClose = () => setShowNewEvent(false);

    const handleEventChoice = (mode: MODE) => {
        clearEventDataAction();

        dispatch(setMode(mode));
        dispatch(setEarthquakeEvent(null));
        dispatch(setDisplayEventId(null));

        handleClose();
        navigate(`/${PAGES.NEW_EVENT}`);
    };

    const onOpenNewEvent = () => {
        setShowNewEvent(true);
    };

    const onOpenExistingEvent = () => {
        if (earthquakeEvent?.id) {
            navigate(`/${PAGES.DESTRUCTION_SITES}`);
        }
    }

    const logo = require('../assets/Logo.png');

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <img src={logo} alt='Logo' width={150} />
                <Typography variant='h4'>{t('startPage.title')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box sx={buttonsStyle}>
                    {earthquakeEvent?.id &&
                        <MainButton onClick={onOpenExistingEvent} bgcolor={mode == MODE.TRIAL ? trialOptionalButtonColor : emergencyOptionalButtonColor}>
                            {t('startPage.openExistingEvent')}
                        </MainButton>
                    }
                    <MainButton onClick={onOpenNewEvent}>
                        {t('startPage.openNewEvent')}
                    </MainButton>
                </Box>
                <Box sx={buttonsStyle}>
                    <SecondaryButton onClick={() => navigate(`/${PAGES.MANAGE_EVENTS}`)}>
                        {t('startPage.eventsHistory')}
                    </SecondaryButton>
                    <SecondaryButton onClick={() => navigate(`/${PAGES.MANAGE_NATARS}`)}>
                        {t('startPage.manageNatars')}
                    </SecondaryButton>
                    <SecondaryButton onClick={() => navigate(`/${PAGES.MANAGE_STAFF}`)}>
                        {t('startPage.manageStaffButton')}
                    </SecondaryButton>
                    <SecondaryButton onClick={() => navigate(`/${PAGES.OTHER_ACTIONS}`)}>
                        {t('startPage.otherActionsButton')}
                    </SecondaryButton>
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

            {summaryData && (
                <Modal open={showModal} onClose={() => setShowModal(false)}>
                    <Box sx={eventSummaryModalStyle}>
                        <EventSummaryModal summary={summaryData} onClose={() => setShowModal(false)} />
                    </Box>
                </Modal>
            )}

            <LoadingPopup loadingMessage={loadingMessage} showLoadingPopup={showLoadingPopup} />
        </>
    );
};

export default StartPage;