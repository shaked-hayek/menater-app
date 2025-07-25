import { useEffect, useState } from 'react';
import { Box, Container, Typography, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';
import { getEventsAction } from 'actions/events/eventsActions';
import { ErrorPopup, LoadingPopup } from 'components/atoms/Popups';
import EventSummaryModal, { eventSummaryModalStyle } from './EventSummaryModal';
import { createEventSummaryAction, getEventSummaryAction, loadEventDataFromSummaryAction } from 'actions/events/eventSummaryActions';
import EventsTable from './EventsTable';
import { setEventDataForSystem } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';


const ManageEvents = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { earthquakeEvent } = useSelector((state: RootState) => state.appState);

    const [events, setEvents] = useState<EarthquakeEvent[]>([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoadingPopup, setShowLoadingPopup] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState(t('manageEvents.loading'));
    const [showModal, setShowModal] = useState(false);
    const [summaryData, setSummaryData] = useState<any>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsResponse = await getEventsAction();
                setEvents(eventsResponse);
                setShowLoadingPopup(false);
            } catch (error) {
                setShowLoadingPopup(false);
                setErrorMessage(t('manageEvents.errorMsgs.serverGetError') + `\nerror: ${error}`);
                setShowErrorPopup(true);
            }
        };

        fetchEvents();
    }, []);

    const handleShowSummary = async (eventId: string) => {
        try {
            setShowLoadingPopup(true);

            const summary = await getEventSummaryAction(eventId);
            if (!summary) {
                setShowLoadingPopup(false);
                setErrorMessage(t('manageEvents.noSummary'));
                setShowErrorPopup(true);
                return;
            }

            setSummaryData(summary);
            setShowModal(true);
            setShowLoadingPopup(false);
        } catch (error) {
            setShowLoadingPopup(false);
            setErrorMessage(t('manageEvents.errorMsgs.serverSummaryError') + `\nerror: ${error}`);
            setShowErrorPopup(true);
        }
    };

    const handleLoadEventData = async (eventId: string) => {
        try {
            setLoadingMessage(t('manageEvents.loadingEventData'));
            setShowLoadingPopup(true);

            // Save current event summary before loading a new one
            if (earthquakeEvent?.id) {
                createEventSummaryAction(earthquakeEvent.id);
            }

            const response = await loadEventDataFromSummaryAction(eventId);

            // Load Earthquake event details to store
            const selectedEvent = events.find(event => event.id === eventId);
            setEventDataForSystem(selectedEvent!, dispatch);
            setShowLoadingPopup(false);
        } catch (error) {
            setShowLoadingPopup(false);
            setErrorMessage(t('manageEvents.errorMsgs.serverLoadEventError') + `\nerror: ${error}`);
            setShowErrorPopup(true);
        }
    };


    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
            <Typography variant='h4' sx={{ textAlign: 'center', mt: 2 }}>
                {t('manageEvents.title')}
            </Typography>

            <EventsTable events={events} onViewSummary={handleShowSummary} onLoadEvent={handleLoadEventData} />

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={eventSummaryModalStyle}>
                    <EventSummaryModal summary={summaryData} onClose={() => setShowModal(false)} />
                </Box>
            </Modal>

            <LoadingPopup loadingMessage={loadingMessage} showLoadingPopup={showLoadingPopup} />

            <ErrorPopup
                errorMessage={errorMessage}
                showErrorPopup={showErrorPopup}
                setShowErrorPopup={setShowErrorPopup}
            />
        </Container>
    );
};

export default ManageEvents;
