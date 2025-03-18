import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const MINUTE_IN_MILLI = 60000;

const TimeSince = ({ date }: { date: Date }) => {
    const { t } = useTranslation();

    const calculateTimeSince = () => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime(); // Difference in milliseconds

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return { days, hours, minutes };
    };

    const [timeSince, setTimeSince] = useState(calculateTimeSince());

    useEffect(() => {
        const interval = setInterval(() => {
        setTimeSince(calculateTimeSince());
        }, MINUTE_IN_MILLI);

        return () => clearInterval(interval);
    }, [date]);

    return (
        <Box display='flex' gap={2} flexDirection={'row-reverse'}>
            <Box textAlign='center'>
                <Typography variant='body2'>{timeSince.days}</Typography>
                <Typography variant='caption'>{t('timer.days')}</Typography>
            </Box>
            <Box textAlign='center'>
                <Typography variant='body2'>{timeSince.hours}</Typography>
                <Typography variant='caption'>{t('timer.hours')}</Typography>
            </Box>
            <Box textAlign='center'>
                <Typography variant='body2'>{timeSince.minutes}</Typography>
                <Typography variant='caption'>{t('timer.minutes')}</Typography>
            </Box>
        </Box>
    );
};

export default TimeSince;
