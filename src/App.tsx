import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';

import StartPage from 'pages/StartPage';
import Layout from 'components/Layout';
import NewEvent from 'pages/NewEvent';
import theme from 'style/theme';
import { store } from 'store/store';


const App = () => {
  const { i18n } = useTranslation();
  const appDir = i18n.dir();

  useEffect(() => {
    document.body.dir = appDir;
  }, [i18n, appDir]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<StartPage />} />
              <Route path="newEvent" element={<NewEvent />} />
              {/* <Route path="destructionSites" element={<DestructionSites />} /> */}
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;