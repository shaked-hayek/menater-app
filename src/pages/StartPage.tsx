import { useState } from "react";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { MainButton, SeconderyButton } from "components/atoms/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setMode } from "store/store";
import { MODE } from "consts/mode.const";

const StartPage = () => {
    const [showNewEvent, setShowNewEvent] = useState(false);
    const handleClose = () => setShowNewEvent(false);
    const handleEventChoice = (mode: MODE) => {
        dispatch(setMode(MODE.TRIAL));
        handleClose();
        // redirect
    };
    const handleShow = () => setShowNewEvent(true);
    
    const { t } = useTranslation();
    const mode = useSelector((state: RootState) => state.mode.mode);
    const dispatch = useDispatch();

    return (
        <>
            <Container>
                <h1>{t('startPage.title')}</h1>
            </Container>
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <div className="d-flex flex-column me-5">
                <SeconderyButton>
                    {t('startPage.eventsHistory')}
                </SeconderyButton>
                <SeconderyButton>
                    {t('startPage.manageNatars')}
                </SeconderyButton>
                <SeconderyButton>
                    {t('startPage.manageStaff')}
                </SeconderyButton>
                <SeconderyButton>
                    {t('startPage.synchronize')}
                </SeconderyButton>
                <SeconderyButton>
                    {t('startPage.settings')}
                </SeconderyButton>
                </div>
                <MainButton onClick={handleShow}>
                    {t('startPage.openEvent')}
                </MainButton>
            </Container>
            <Modal show={showNewEvent} onHide={handleClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>{t('startPage.chooseEventType')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center">
                <Button
                    variant="danger"
                    className="me-3"
                    size="lg"
                    onClick={() => handleEventChoice(MODE.EMERGENCY)}
                    // as={Link}
                    // to="/newEvent"
                >
                    {t('startPage.emergencyEvent')}
                </Button>
                <Button
                    variant="secondary"
                    className="me-3"
                    size="lg"
                    onClick={() => handleEventChoice(MODE.TRIAL)}
                    // as={Link}
                    // to="/newEvent"
                >
                    {t('startPage.trialEvent')}
                </Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default StartPage;