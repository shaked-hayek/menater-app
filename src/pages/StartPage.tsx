import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Modal, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import { EmergencyButton, MainButton, SecondaryButton, TrialButton } from 'components/atoms/Buttons';
import { setEarthquakeEvent, setMode } from 'store/store';
import { MODE } from 'consts/mode.const';
import { PAGES } from 'consts/pages.const';
import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';
import { getEventsAction } from 'actions/events/eventsActions';
import { LoadingPopup } from 'components/atoms/Popups';
import { setEventDataForSystem } from 'utils';
import { clearEventDataAction, createEventSummaryAction, getEventSummaryAction } from 'actions/events/eventSummaryActions';
import EventSummaryModal, { eventSummaryModalStyle } from 'components/Events/EventSummaryModal';
import { errorHandler } from 'actions/errors/errorHandler';


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

    const [showNewEvent, setShowNewEvent] = useState(false);
    const [latestEvent, setLatestEvent] = useState<EarthquakeEvent>();
    const [showLoadingPopup, setShowLoadingPopup] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [summaryData, setSummaryData] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const oldEventsResponse = await getEventsAction();
            if (oldEventsResponse.length == 0) {
                setLatestEvent(undefined);
                return;
            }
            const latestEventResponse = oldEventsResponse.reduce((latest: EarthquakeEvent, current: EarthquakeEvent) => {
                const latestTime = new Date(latest.timeOpened || 0).getTime();
                const currentTime = new Date(current.timeOpened || 0).getTime();
                return currentTime > latestTime ? current : latest;
            });
            setLatestEvent(latestEventResponse);
          } catch (error) {
            errorHandler(dispatch, t('startPage.errorMsgs.serverGetError'), error);
          }
        };

        fetchEvents();
    }, []);

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
    }, [location.state, latestEvent]);

    const handleClose = () => setShowNewEvent(false);

    const handleEventChoice = (mode: MODE) => {
        if (latestEvent?.id) {
            createEventSummaryAction(latestEvent.id)
        }
        clearEventDataAction();

        dispatch(setMode(mode));
        dispatch(setEarthquakeEvent(null));

        handleClose();
        navigate(`/${PAGES.NEW_EVENT}`);
    };

    const onOpenNewEvent = () => {
        setShowNewEvent(true);
    };

    const onOpenExistingEvent = () => {
        if (latestEvent) {
            setEventDataForSystem(latestEvent, dispatch);
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
                <Box sx={buttonsStyle}>
                    {latestEvent &&
                        <MainButton onClick={onOpenExistingEvent}>
                            {t('startPage.openExistingEvent')}
                        </MainButton>
                    }
                    <MainButton onClick={onOpenNewEvent}>
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