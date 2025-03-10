import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from './Header';

const Layout = () => {
    const headerHeight = '5vh';

    return (
        <>
            <Box height={headerHeight} display='flex'>
                <Header />
            </Box>
            <Outlet />
        </>
    );
};

export default Layout;
