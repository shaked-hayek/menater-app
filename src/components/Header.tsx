import React from 'react';
import { useState } from 'react';
import { Outlet, Link } from 'react-router';

import { Container, Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

const Header = () => {
    const { t } = useTranslation();
    const [ timeString, setTimeString ] = useState('');

    const updateTime = () => {
        setTimeString(new Date().toLocaleTimeString('en-GB'));
    };
    setInterval(updateTime);

    return (
        <Box>
            <Navbar expand='lg' className='bg-body-tertiary'>
                <Container>
                <Navbar.Brand>{t('header.title')}</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className='me-auto'>
                    <Nav.Link as={Link} to='/'>
                        {t('header.home')}
                    </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className='justify-content-end'>
                    <Navbar.Text>{timeString}</Navbar.Text>
                </Navbar.Collapse>
                </Container>
            </Navbar>
        </Box>
    );
};

export default Header;