import { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import TimeSince from './atoms/Timer';
import { MODE } from 'consts/mode.const';
import { themeColor, trialColor, waitingOrange, successGreen, errorRed } from 'style/colors';

const Header = () => {
    const { t } = useTranslation();
    const [ currentTimeString, setCurrentTimeString ] = useState('');
    const { arcgisAuth, earthquakeTime, mode } = useSelector((state: RootState) => state.appState);

    const updateTime = () => {
        setCurrentTimeString(new Date().toLocaleTimeString('en-GB'));
    };
    setInterval(updateTime);

    return (
        <AppBar position='static'>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant='h6'>{t('header.title')}</Typography>
                    <Button color='inherit' component={Link} to='/'>
                        {t('header.home')}
                    </Button>
                    <Typography
                        variant='body1'
                        color={arcgisAuth ? successGreen : (arcgisAuth == null ? waitingOrange : errorRed)}
                        fontWeight='bold'
                    >
                        {arcgisAuth ? t('header.arcgisConnected') : (
                            arcgisAuth == null ? t('header.arcgisWaitingConnection') : t('header.arcgisConnectionError')
                        )}
                    </Typography>
                </Box>

                {earthquakeTime && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant='body1'>{t('header.timeSince')}</Typography>
                        <TimeSince date={earthquakeTime} />
                    </Box>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2}}>
                    <Typography variant='body2'>{currentTimeString}</Typography>
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