import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import { useTranslation } from 'react-i18next';
import { DestructionSite } from 'components/Interfaces/DestructionSite';
import { Natar, RecommendedNatar } from 'components/Interfaces/Natar';
import { StaffMember } from 'components/Interfaces/StaffMember';

interface EventSummery {
    eventId: string;
    destructionSites: DestructionSite[];
    recommendedNatars: Natar[];
}

interface EventSummaryModalProps {
    summary: EventSummery;
    onClose: () => void;
}

const EventSummaryModal = ({ summary, onClose } : EventSummaryModalProps) => {
    const { t } = useTranslation();

    if (!summary) return null;

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-summary-${summary.eventId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Box sx={{ position: 'relative', textAlign: 'right' }} dir='rtl'>
            {/* Top-left action icons */}
            <Box sx={{ position: 'absolute', top: 2, left: 8, display: 'flex', gap: 1 }}>
                <Tooltip title={t('buttons.print')}>
                    <IconButton onClick={handlePrint}>
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

            <Typography variant='h5' sx={{ mb: 2 }}>
                {t('eventSummary.title')}
            </Typography>

            <Typography variant='subtitle1' sx={{ mt: 2, fontWeight: 'bold'}}>
                {t('eventSummary.destructionSites')}:
            </Typography>
            {summary.destructionSites.map((site: DestructionSite, idx: number) => (
                <Box key={idx} sx={{ mr: 2 }}>
                    <Typography variant='body1'>
                        {t('eventSummary.address')}: {site.street} {site.number}, {t('eventSummary.casualties')}: {site.casualties}
                    </Typography>
                </Box>
            ))}

            <Typography variant='subtitle1' sx={{ mt: 2, fontWeight: 'bold'}}>
                {t('eventSummary.recommendedNatars')}:
            </Typography>
            {summary.recommendedNatars.map((natar: any, idx: number) => (
                <Box key={idx} sx={{ mr: 2, mb: 2 }}>
                    <Typography variant='body1'>
                        {t('eventSummary.natar')}: {natar.id}
                    </Typography>
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
    );
};

export default EventSummaryModal;
