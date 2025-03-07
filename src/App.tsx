import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from 'pages/StartPage';
import Layout from 'components/Layout';
import NewEvent from 'pages/NewEvent';


const App = () => {
  const { i18n } = useTranslation();

  const appDir = i18n.dir();

  useEffect(() => {
    document.body.dir = appDir;
  }, [i18n, appDir]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StartPage />} />
          <Route path="newEvent" element={<NewEvent />} />
          {/* <Route path="destructionSites" element={<DestructionSites />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;