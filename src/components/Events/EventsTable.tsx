import {
    TableCell,
    TableRow,
    IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTranslation } from 'react-i18next';

import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';
import { MODE } from 'consts/mode.const';
import { formatDateTime } from 'utils';
import ManageTable from 'components/atoms/ManageTable';

interface EventsTableProps {
    events: EarthquakeEvent[];
    onViewSummary: (eventId: string) => void;
    onLoadEvent: (eventId: string, index: number) => void;
}

const EventsTable = ({ events, onViewSummary, onLoadEvent }: EventsTableProps) => {
    const { t } = useTranslation();

    const sortDates = (a : EarthquakeEvent, b : EarthquakeEvent) => {
        return new Date(b.timeUpdated || 0).getTime() - new Date(a.timeUpdated || 0).getTime();
    };

    return (
        <ManageTable
            headerFields={
                <>
                    <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                        {t('manageEvents.columns.eventId')}
                    </TableCell>
                    <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                        {t('manageEvents.columns.mode')}
                    </TableCell>
                    <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                        {t('manageEvents.columns.earthquakeMagnitude')}
                    </TableCell>
                    <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                        {t('manageEvents.columns.earthquakeTime')}
                    </TableCell>
                    <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                        {t('manageEvents.columns.timeOpened')}
                    </TableCell>
                    <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                        {t('manageEvents.columns.timeUpdated')}
                    </TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', padding: '0 8px' }}>
                        {t('manageEvents.columns.showSummary')}
                    </TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', padding: '0 8px' }}>
                        {t('manageEvents.columns.loadEventData')}
                    </TableCell>
                </>
            }
            rows ={
                <>
                    {[...events]
                        .sort(sortDates)
                        .map((event, index) => (
                            <TableRow key={event.id}>
                                <TableCell align='right'>{index + 1}</TableCell>
                                <TableCell align='right'>{event.mode == MODE.TRIAL ? t('trial') : t('emergency')}</TableCell>
                                <TableCell align='right'>{event.earthquakeMagnitude}</TableCell>
                                <TableCell align='right'>{formatDateTime(event.earthquakeTime)}</TableCell>
                                <TableCell align='right'>{event.timeOpened ? formatDateTime(event.timeOpened) : ''}</TableCell>
                                <TableCell align='right'>{event.timeUpdated ? formatDateTime(event.timeUpdated) : ''}</TableCell>
                                <TableCell align='center' sx={{ padding: '0 8px' }}>
                                    <IconButton onClick={() => onViewSummary(event.id!)}>
                                        <VisibilityIcon color='primary' />
                                    </IconButton>
                                </TableCell>
                                <TableCell align='center' sx={{ padding: '0 8px' }}>
                                    <IconButton onClick={() => onLoadEvent(event.id!, index)}>
                                        <FileUploadIcon color='primary' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                    ))}
                </>
            }
        />
    );
};

export default EventsTable;
