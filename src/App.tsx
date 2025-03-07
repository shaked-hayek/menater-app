import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { useTranslation } from 'react-i18next';
import Header from './components/Header'; 

const headerHeight = '5vh';

const App = () => {
  const { i18n } = useTranslation();

  const appDir = i18n.dir();

  useEffect(() => {
    document.body.dir = appDir;
  }, [i18n, appDir]);

  return (
    <Router>
      <Box>
        <Box height={headerHeight} display="flex">
          <Header />
        </Box>
      </Box>
    </Router>
  );
};

export default App;