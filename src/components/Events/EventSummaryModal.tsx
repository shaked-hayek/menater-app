import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import { useTranslation } from 'react-i18next';
import { DestructionSite } from 'components/Interfaces/DestructionSite';
import { Natar, RecommendedNatar, mapNatars } from 'components/Interfaces/Natar';
import { StaffMember } from 'components/Interfaces/StaffMember';
import { getNatarsByIds } from 'actions/natars/natarsActions';
import { handlePrint } from './eventsUtils';
import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';
import { computeNatarCapacity, computeOptionalNatarCapacity, formatDateTime } from 'utils';
import { MODE } from 'consts/mode.const';


interface EventSummery {
    eventId: string;
    event: EarthquakeEvent;
    destructionSites: DestructionSite[];
    recommendedNatars: RecommendedNatar[];
}

interface EventSummaryModalProps {
    summary: EventSummery;
    onClose: () => void;
}

export const eventSummaryModalStyle = {
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

const EventSummaryModal = ({ summary, onClose } : EventSummaryModalProps) => {
    if (!summary) return null;

    const { t } = useTranslation();
    const [fullRecommendedNatars, setFullRecommendedNatars] = useState<Natar[]>([]);
    const [natarIdToNameMap, setNatarIdToNameMap] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchNatars = async () => {
            const natarIds = summary.recommendedNatars.map(n => n.id);
            if (natarIds.length === 0) return;

            try {
                const natars = await getNatarsByIds(natarIds);
                const mappedNatars = mapNatars(natars);

                const wasOpenedMap = Object.fromEntries(
                    summary.recommendedNatars.map(n => [n.id, n.opened])
                  );
                  
                  const combinedNatars = mappedNatars.map(natar => ({
                    ...natar,
                    wasOpened: wasOpenedMap[natar.id] ?? false
                  }));

                setFullRecommendedNatars(combinedNatars);

                setNatarIdToNameMap(prevMap =>
                    Object.fromEntries(
                        mappedNatars.map(natar => [natar.id, natar.name])
                    )
                );
            } catch (err) {
                console.error('Failed to fetch natars:', err);
            }
        };

        fetchNatars();
    }, [summary.recommendedNatars]);


    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-summary-${summary.eventId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ position: 'relative', textAlign: 'right' }} dir='rtl' className='event-summary-modal'>
            {/* Top-left action icons */}
            <Box sx={{ position: 'absolute', top: 2, left: 8, display: 'flex', gap: 1 }}>
                <Tooltip title={t('buttons.print')}>
                    <IconButton onClick={() => handlePrint(`event-summary-${summary.eventId}`)}>
                        <PrintIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('buttons.download')}>
                    <IconButton onClick={handleDownload}>
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('buttons.close')}>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box className='printable'>
                <Typography variant='h5' sx={{ mb: 2 }}>
                    {t('eventSummary.title')}
                </Typography>

                <Typography variant='subtitle1' sx={{ mt: 2, fontWeight: 'bold'}}>
                    {t('eventSummary.eventDetails')}:
                </Typography>
                <Box sx={{ mr: 2 }}>
                    <Typography variant='body1'>
                        {t('manageEvents.columns.mode')}: {summary.event.mode == MODE.TRIAL ? t('trial') : t('emergency')}
                    </Typography>
                    <Typography variant='body1'>
                        {t('manageEvents.columns.earthquakeMagnitude')}: {summary.event.earthquakeMagnitude}
                    </Typography>
                    <Typography variant='body1'>
                        {t('manageEvents.columns.earthquakeTime')}: {formatDateTime(summary.event.earthquakeTime)}
                    </Typography>
                    <Typography variant='body1'>
                        {t('manageEvents.columns.timeOpened')}: {formatDateTime(summary.event.timeOpened!)}
                    </Typography>
                    <Typography variant='body1'>
                        {t('eventSummary.totalCasualties')}: {summary.destructionSites.reduce((sum, obj) => sum + obj.casualties, 0)}
                    </Typography>
                    <Typography variant='body1'>
                        {t('eventSummary.natarCapacity')}: {computeNatarCapacity(fullRecommendedNatars)}
                    </Typography>
                    <Typography variant='body1'>
                        {t('eventSummary.natarOptionalCapacity')}: {computeOptionalNatarCapacity(fullRecommendedNatars)}
                    </Typography>
                </Box>

                <Typography variant='subtitle1' sx={{ mt: 2, fontWeight: 'bold'}}>
                    {t('eventSummary.destructionSites')}:
                </Typography>
                {summary.destructionSites.map((site: DestructionSite, idx: number) => (
                    <Box key={idx} sx={{ mr: 2, mb: 2 }}>
                        <Typography variant='body1'>
                            {site.street} {site.number}
                        </Typography>
                        <Typography variant='body2' sx={{ mr: 2 }}>
                            {t('eventSummary.casualties')}: {site.casualties}
                        </Typography>
                        {site.coupledNatarId &&
                            <Typography variant='body2' sx={{ mr: 2 }}>
                                {t('eventSummary.natarForSite')}: {site.coupledNatarId}
                            </Typography>
                        }
                    </Box>
                ))}

                <Typography variant='subtitle1' sx={{ mt: 2, fontWeight: 'bold'}}>
                    {t('eventSummary.recommendedNatars')}:
                </Typography>
                {summary.recommendedNatars.map((natar: any, idx: number) => (
                    <Box key={idx} sx={{ mr: 2, mb: 2 }}>
                        <Typography variant='body1'>
                            {natar.id} - {t('eventSummary.natar')}: {natarIdToNameMap[natar.id]}
                        </Typography>
                        {natar.opened &&
                            <Typography variant='body2' sx={{ mr: 2 }}>
                                {t('eventSummary.wasOpened')}{formatDateTime(natar.time_updated)}
                            </Typography>
                        }
                        {natar.staff.length > 0 && (
                            <>
                                <Typography variant='body2' sx={{ mr: 2 }}>
                                    {t('eventSummary.staff')} -
                                </Typography>
                                <ul style={{ marginTop: 0 }}>
                                    {natar.staff.map((staff: StaffMember, sIdx: number) => (
                                        <li key={sIdx}>
                                            <Typography variant='body2'>
                                                {staff.name} - {staff.occupation} {staff.phoneNumber}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default EventSummaryModal;
