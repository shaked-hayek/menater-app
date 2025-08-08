import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/he';

import theme from 'style/theme';
import { store } from 'store/store';
import ArcgisProvider from 'services/ArcgisProvider';
import { LANGUAGES } from 'consts/languages.const';
import ErrorBoundary from 'components/ErrorBoundary';
import AppContent from 'AppContent';

const currentLanguage = LANGUAGES.HE;

const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <ArcgisProvider />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={currentLanguage}>
            <AppContent />
          </LocalizationProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
