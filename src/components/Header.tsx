import { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import TimeSince from './atoms/Timer';

const Header = () => {
    const { t } = useTranslation();
    const [ currentTimeString, setCurrentTimeString ] = useState('');
    const earthquakeTime = useSelector((state: RootState) => state.appState.earthquakeTime);

    const updateTime = () => {
        setCurrentTimeString(new Date().toLocaleTimeString('en-GB'));
    };
    setInterval(updateTime);

    return (
        <AppBar position='static'>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant='h6'>{t('header.title')}</Typography>
                    <Button color='inherit' component={Link} to='/'>
                        {t('header.home')}
                    </Button>
                </Box>

                {earthquakeTime && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant='body1'>{t('header.timeSince')}</Typography>
                        <TimeSince date={earthquakeTime} />
                    </Box>
                )}

                <Typography variant='body2'>{currentTimeString}</Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;