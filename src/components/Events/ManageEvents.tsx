import { useEffect, useState } from 'react';
import { Box, Container, Typography, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';
import { getEventsAction } from 'actions/events/eventsActions';
import { ErrorPopup, LoadingPopup } from 'components/atoms/Popups';
import EventSummaryModal from './EventSummaryModal';
import { getEventSummaryAction } from 'actions/events/eventSummaryActions';
import EventsTable from './EventsTable';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '85%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: 'center',
    overflowY: 'auto',
};

const ManageEvents = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState<EarthquakeEvent[]>([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoadingPopup, setShowLoadingPopup] = useState(true);
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

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
            <Typography variant='h4' sx={{ textAlign: 'center', mt: 2 }}>
                {t('manageEvents.title')}
            </Typography>

            <EventsTable events={events} onViewSummary={handleShowSummary} />

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={modalStyle}>
                    <EventSummaryModal summary={summaryData} />
                </Box>
            </Modal>

            <LoadingPopup loadingMessage={t('manageEvents.loading')} showLoadingPopup={showLoadingPopup} />

            <ErrorPopup
                errorMessage={errorMessage}
                showErrorPopup={showErrorPopup}
                setShowErrorPopup={setShowErrorPopup}
            />
        </Container>
    );
};

export default ManageEvents;
