import { useState } from "react";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { MainButton, SeconderyButton } from "components/atoms/Buttons";

const StartPage = () => {
    const [showNewEvent, setShowNewEvent] = useState(false);
    const handleClose = () => setShowNewEvent(false);
    const handleShow = () => setShowNewEvent(true);
    const { t } = useTranslation();

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
                    onClick={handleClose}
                    // as={Link}
                    // to="/newEvent"
                    // state={{ isDummy: false }}
                >
                    {t('startPage.emergencyEvent')}
                </Button>
                <Button
                    variant="secondary"
                    className="me-3"
                    size="lg"
                    onClick={handleClose}
                    // as={Link}
                    // to="/newEvent"
                    // state={{ isDummy: true }}
                >
                    {t('startPage.trialEvent')}
                </Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default StartPage;