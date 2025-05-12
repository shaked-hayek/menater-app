import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import StartPage from 'pages/StartPage';
import Layout from 'components/Layout';
import NewEvent from 'pages/NewEvent';
import theme from 'style/theme';
import { store } from 'store/store';
import DestructionSites from 'pages/DestructionSites';
import { LANGUAGES } from 'consts/languages.const';
import 'dayjs/locale/he';
import RecommendedNatars from 'pages/RecommendedNatars';
import { PAGES } from 'consts/pages.const';
import ManageStaff from 'pages/ManageStaff';
import { setupArcGISAuth } from 'services/arcGISAuth.service';


const App = () => {
  const { i18n } = useTranslation();
  const appDir = i18n.dir();
  const currentLanguage = LANGUAGES.HE; // TODO: when adding more languages, move this to store

  useEffect(() => {
    // https://material-ui.com/guides/right-to-left/
    document.body.dir = appDir;
    theme.direction = appDir;
  }, [i18n, theme, theme.direction, appDir]);

  useEffect(() => {
    setupArcGISAuth().then(success => {
      if (success) {
        // auth success
        console.log('######## auth success')
      } else {
        // Failed to connect to ArcGIS. Please check your credentials
        console.log('######## Failed to connect to ArcGIS. Please check your credentials')
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={currentLanguage}>
          <Router>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route index element={<StartPage />} />
                <Route path={PAGES.MANAGE_STAFF} element={<ManageStaff />} />
                <Route path={PAGES.NEW_EVENT} element={<NewEvent />} />
                <Route path={PAGES.DESTRUCATION_SITES} element={<DestructionSites />} />
                <Route path={PAGES.RECOMMENDED_NATARS} element={<RecommendedNatars />} />
              </Route>
            </Routes>
          </Router>
          </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;