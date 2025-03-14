import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from './Header';
import { backgroundColor, lightBgColor } from 'style/colors';

const Layout = () => {
    const headerHeight = '10vh';

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ height: headerHeight, display: 'flex', bgcolor: lightBgColor }}>
                <Header />
            </Box>
            <Box sx={{ 
                flexGrow: 1,
                bgcolor: backgroundColor,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingTop: '1rem',
                flexDirection: 'column',
             }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
