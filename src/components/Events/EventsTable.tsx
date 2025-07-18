import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Box,
    Paper,
    TableContainer,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { tableBgColor } from 'style/colors';
import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';
import { MODE } from 'consts/mode.const';
import { formatDateTime } from 'utils';

interface FullEventsTableProps {
    events: EarthquakeEvent[];
    onViewSummary: (eventId: string) => void;
}

const EventsTable = ({ events, onViewSummary }: FullEventsTableProps) => {
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
                                    {t('manageNatars.columns.mode')}
                                </TableCell>
                                <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                                    {t('manageNatars.columns.earthquakeMagnitude')}
                                </TableCell>
                                <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                                    {t('manageNatars.columns.earthquakeTime')}
                                </TableCell>
                                <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                                    {t('manageNatars.columns.timeOpened')}
                                </TableCell>
                                <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                                    {t('manageNatars.columns.actions')}
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
                                        <TableCell align='right'>
                                            <IconButton onClick={() => onViewSummary(event.id!)}>
                                                <Visibility color='primary' />
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
