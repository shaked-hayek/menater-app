import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import StartPage from 'pages/StartPage';
import Layout from 'components/Layout';
import NewEvent from 'pages/NewEvent';
import DestructionSites from 'pages/DestructionSites';
import RecommendedNatars from 'pages/RecommendedNatars';
import ManageStaff from 'pages/ManageStaff';
import ManageNatars from 'pages/ManageNatars';
import ManageEvents from 'pages/ManageEvents';
import OtherActions from 'pages/OtherActions';

import { RootState } from 'store/store';
import { PAGES } from 'consts/pages.const';
import { ErrorPopup } from 'components/atoms/Popups';
import { hideError } from 'store/slices/errorSlice';


const AppContent = () => {
    const { i18n } = useTranslation();
    const appDir = i18n.dir();
    const dispatch = useDispatch();
    const { message: errorMessage, error, visible: showErrorPopup } = useSelector(
        (state: RootState) => state.error
    );

    useEffect(() => {
        document.body.dir = appDir;
    }, [appDir]);

    return (
        <>
            <Router>
                <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<StartPage />} />
                    <Route path={PAGES.MANAGE_STAFF} element={<ManageStaff />} />
                    <Route path={PAGES.MANAGE_EVENTS} element={<ManageEvents />} />
                    <Route path={PAGES.MANAGE_NATARS} element={<ManageNatars />} />
                    <Route path={PAGES.NEW_EVENT} element={<NewEvent />} />
                    <Route path={PAGES.DESTRUCTION_SITES} element={<DestructionSites />} />
                    <Route path={PAGES.RECOMMENDED_NATARS} element={<RecommendedNatars />} />
                    <Route path={PAGES.OTHER_ACTIONS} element={<OtherActions />} />
                </Route>
                </Routes>
            </Router>

            <ErrorPopup
                errorMessage={errorMessage}
                errorMessageOriginal={error?.message || null}
                showErrorPopup={showErrorPopup}
                onClose={() => dispatch(hideError())}
            />
        </>
    );
};

export default AppContent;
