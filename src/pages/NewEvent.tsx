import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function NewEvent() {
  let { state } = useLocation();
  state = state || {};
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState({
    intensity: "",
    dateTime: "",
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    navigate("/destructionSites");
  };

  const generateRandomValues = () => {
    const randomIntensity = (Math.random() * 10).toFixed(1);
    const randomDateTime = new Date(
      Date.now() + Math.floor(Math.random() * 10000000000)
    )
      .toISOString()
      .slice(0, 16);

    setFormValues({
      intensity: randomIntensity,
      dateTime: randomDateTime,
    });
  };

  return (
    <>
      <Container>
        <h1>{t('newEvent.create', { type: state?.isDummy ? t('trial') : t('emergency') })}</h1>
      </Container>
      <Container className="form-wrapper">
        <Form className="centered-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{t('newEvent.earthquakeMagnitude')}</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={formValues.intensity}
              onChange={(e) =>
                setFormValues({ ...formValues, intensity: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('newEvent.earthquakeTime')}</Form.Label>
            <Form.Control
              type="datetime-local"
              value={formValues.dateTime}
              onChange={(e) =>
                setFormValues({ ...formValues, dateTime: e.target.value })
              }
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {t('buttons.next')}
          </Button>
          {state.isDummy && (
            <Button
              variant="secondary"
              type="button"
              className="ms-2"
              onClick={generateRandomValues}
            >
              {t('buttons.createData')}
            </Button>
          )}
        </Form>
      </Container>
    </>
  );
}

export default NewEvent;
