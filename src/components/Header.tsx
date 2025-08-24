import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RootState } from 'store/store';
import TimeSince from './atoms/Timer';
import { MODE } from 'consts/mode.const';
import { themeColor, trialColor, waitingOrange, successGreen, errorRed } from 'style/colors';
import { useNavigate } from 'react-router';
import { createEventSummaryAction } from 'actions/events/eventSummaryActions';
import { errorHandler } from 'actions/errors/errorHandler';


const Header = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [ currentTimeString, setCurrentTimeString ] = useState('');
    const { arcgisAuth, earthquakeEvent, mode, displayEventId } = useSelector((state: RootState) => state.appState);

    useEffect(() => {
        const updateTime = () => {
            setCurrentTimeString(new Date().toLocaleTimeString('en-GB'));
        };

        updateTime(); // Initial call
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval); // Cleanup
    }, []);

    const onHomeRoute = async () => {
        if (earthquakeEvent?.id) {
            try {
                await createEventSummaryAction(earthquakeEvent.id);
            } catch (error) {
                errorHandler(dispatch, t('destructionSites.errorMsgs.errorGettingRecommendation'), error);
            }
        }
        navigate('/');
    }

    return (
        <AppBar position='static'>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant='h6'>{t('header.title')}</Typography>
                    <Button color='inherit' onClick={onHomeRoute}>
                        {t('header.home')}
                    </Button>
                    <Typography
                        variant='body1'
                        color={arcgisAuth ? successGreen : (arcgisAuth == null ? waitingOrange : errorRed)}
                        fontWeight='bold'
                        sx={{ whiteSpace: 'nowrap', alignSelf: 'center' }}
                    >
                          {arcgisAuth
                            ? t('header.arcgisConnected')
                            : arcgisAuth == null
                            ? t('header.arcgisWaitingConnection')
                            : t('header.arcgisConnectionError')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                    {displayEventId && (
                        <Typography variant='body1'>🔍 {t('header.eventIdDisplay')} #{displayEventId}</Typography>
                    )}
                    {earthquakeEvent?.earthquakeTime && (
                        <>
                            <Typography variant='body1'>⏱️ {t('header.timeSince')}</Typography>
                            <TimeSince date={earthquakeEvent.earthquakeTime} />
                        </>
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2}}>
                    <Typography variant='body1' sx={{ minWidth: '120px', textAlign: 'left' }}>{currentTimeString}</Typography>
                    {mode && (
                        mode == MODE.TRIAL ?
                        (<Box sx={{backgroundColor: trialColor, borderRadius: '10%', p: 1}}>
                            <Typography>{t('trial')}</Typography>
                        </Box>)
                        :
                        (<Box sx={{backgroundColor: themeColor, borderRadius: '10%', p: 1}}>
                            <Typography>{t('emergency')}</Typography>
                        </Box>)
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;