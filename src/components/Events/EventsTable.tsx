import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Paper,
    TableContainer,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTranslation } from 'react-i18next';

import { tableBgColor } from 'style/colors';
import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';
import { MODE } from 'consts/mode.const';
import { formatDateTime } from 'utils';

interface EventsTableProps {
    events: EarthquakeEvent[];
    onViewSummary: (eventId: string) => void;
    onLoadEvent: (eventId: string) => void;
}

const EventsTable = ({ events, onViewSummary, onLoadEvent }: EventsTableProps) => {
    const { t } = useTranslation();

    const sortDates = (a : EarthquakeEvent, b : EarthquakeEvent) => {
        return new Date(b.timeOpened || 0).getTime() - new Date(a.timeOpened || 0).getTime();
    };

    return (
        <>
            <Paper
                elevation={2}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: tableBgColor,
                }}
            >
                <TableContainer sx={{ maxHeight: '445px' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
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
                                <TableCell align='center' sx={{ fontWeight: 'bold', padding: '0 8px' }}>
                                    {t('manageEvents.columns.showSummary')}
                                </TableCell>
                                <TableCell align='center' sx={{ fontWeight: 'bold', padding: '0 8px' }}>
                                    {t('manageEvents.columns.loadEventData')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...events]
                                .sort(sortDates)
                                .map(event => (
                                    <TableRow key={event.id}>
                                        <TableCell align='right'>{event.mode == MODE.TRIAL ? t('trial') : t('emergency')}</TableCell>
                                        <TableCell align='right'>{event.earthquakeMagnitude}</TableCell>
                                        <TableCell align='right'>{formatDateTime(event.earthquakeTime)}</TableCell>
                                        <TableCell align='right'>{event.timeOpened ? formatDateTime(event.timeOpened) : ''}</TableCell>
                                        <TableCell align='center' sx={{ padding: '0 8px' }}>
                                            <IconButton onClick={() => onViewSummary(event.id!)}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align='center' sx={{ padding: '0 8px' }}>
                                            <IconButton onClick={() => onLoadEvent(event.id!)}>
                                                <FileUploadIcon color='primary' />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};

export default EventsTable;
