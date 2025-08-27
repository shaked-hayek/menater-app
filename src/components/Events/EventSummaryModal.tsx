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
import { LoadingPopup } from 'components/atoms/Popups';
import { errorHandler } from 'actions/errors/errorHandler';
import { useDispatch } from 'react-redux';


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
    const dispatch = useDispatch();

    const [showLoadingPopup, setShowLoadingPopup] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [fullRecommendedNatars, setFullRecommendedNatars] = useState<Natar[]>([]);
    const [natarIdToNameMap, setNatarIdToNameMap] = useState<Record<number, string>>({});
    const [natarIdToOpenedMap, setNatarIdToOpenedMap] = useState<Record<number, boolean | undefined>>({});

    const eventDetails = [
        {
          label: t('manageEvents.columns.mode'),
          value: summary.event.mode === MODE.TRIAL ? t('trial') : t('emergency'),
        },
        {
          label: t('manageEvents.columns.earthquakeMagnitude'),
          value: summary.event.earthquakeMagnitude,
        },
        {
          label: t('manageEvents.columns.earthquakeTime'),
          value: formatDateTime(summary.event.earthquakeTime),
        },
        {
          label: t('manageEvents.columns.timeOpened'),
          value: formatDateTime(summary.event.timeOpened!),
        },
        {
          label: t('eventSummary.totalCasualties'),
          value: summary.destructionSites.reduce((sum, obj) => sum + obj.casualties, 0),
        },
        {
          label: t('eventSummary.natarCapacity'),
          value: computeNatarCapacity(fullRecommendedNatars),
        },
        {
          label: t('eventSummary.natarOptionalCapacity'),
          value: computeOptionalNatarCapacity(fullRecommendedNatars),
        },
      ];

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
                setNatarIdToOpenedMap(wasOpenedMap);

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
            } catch (error) {
                errorHandler(dispatch, t('manageEvents.errorMsgs.serverGetError'), error);
            } finally {
                setShowLoadingPopup(false);
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

            <Box
                className='printable'
                sx={{
                    '& table, & th, & td': { border: '1px solid #ccc', padding: '8px' },
                }}
            >
                <Typography variant='h5' sx={{ mb: 2 }}>
                    {t('eventSummary.title')}
                </Typography>

                <Typography variant='h6' sx={{ mt: 2, fontWeight: 'bold'}}>
                    {t('eventSummary.eventDetails')}
                </Typography>
                <Box sx={{ mr: 2 }}>
                    {eventDetails.map(({ label, value }, index) => (
                        <Typography key={index} variant='body1'>
                            <Box component='span' sx={{ fontWeight: 'bold' }}>
                                {label}:
                            </Box>{' '}
                            {value}
                        </Typography>
                    ))}
                </Box>

                <Typography variant='h6' sx={{ mt: 2, fontWeight: 'bold'}}>
                    {t('eventSummary.destructionSites')}
                </Typography>
                <Box sx={{ overflowX: 'auto', mt: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>
                                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                        {t('eventSummary.address')}
                                    </Typography>
                                </th>
                                <th>
                                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                        {t('eventSummary.casualties')}
                                    </Typography>
                                </th>
                                <th>
                                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                        {t('eventSummary.natarIdForSite')}
                                    </Typography>
                                </th>
                                <th>
                                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                        {t('eventSummary.natarForSite')}
                                    </Typography>
                                </th>
                                <th>
                                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                        {t('eventSummary.natarOpenForSite')}
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.destructionSites.map((site, idx) => (
                                <tr key={idx}>
                                    <td><Typography variant='body2'>{site.street} {site.number}</Typography></td>
                                    <td><Typography variant='body2'>{site.casualties}</Typography></td>
                                    <td><Typography variant='body2'>{site.coupledNatarId ?? '-'}</Typography></td>
                                    <td>
                                        <Typography variant='body2'>
                                            {site.coupledNatarId ? natarIdToNameMap[site.coupledNatarId] : '-'}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant='body2'>
                                            {site.coupledNatarId ? (
                                                natarIdToOpenedMap[site.coupledNatarId] ? t('eventSummary.natarOpen') : t('eventSummary.natarClose')
                                            ) : '-'}
                                        </Typography>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>


                <Typography variant='h6' sx={{ mt: 2, fontWeight: 'bold'}}>
                    {t('eventSummary.recommendedNatars')}
                </Typography>
                <Box sx={{ overflowX: 'auto', mt: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>
                                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                        {t('eventSummary.natarId')}
                                    </Typography>
                                </th>
                                <th>
                                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                        {t('eventSummary.natar')}
                                    </Typography>
                                </th>
                                <th>
                                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                        {t('eventSummary.wasOpened')}
                                    </Typography>
                                </th>
                                <th>
                                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                        {t('eventSummary.staff')}
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.recommendedNatars.map((natar: any, idx: number) => (
                                <tr key={idx}>
                                    <td>
                                        <Typography variant='body2'>
                                            {natar.id}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant='body2'>
                                            {natarIdToNameMap[natar.id]}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant='body2'>
                                            {natar.opened
                                                ? formatDateTime(natar.time_updated)
                                                : t('eventSummary.notOpened')}
                                        </Typography>
                                    </td>
                                    <td>
                                        {natar.staff.length > 0 ? (
                                        <ul style={{ margin: 0, paddingInlineStart: '1rem' }}>
                                            {natar.staff.map((staff: StaffMember, sIdx: number) => (
                                            <li key={sIdx}>
                                                <Typography variant='body2'>
                                                {staff.name} - {staff.occupation} {staff.phoneNumber}
                                                </Typography>
                                            </li>
                                            ))}
                                        </ul>
                                        ) : (
                                        <Typography variant='body2'>-</Typography>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </Box>

            <LoadingPopup loadingMessage={loadingMessage} showLoadingPopup={showLoadingPopup} />
        </Box>
    );
};

export default EventSummaryModal;
