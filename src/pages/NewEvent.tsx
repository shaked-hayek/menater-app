import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { MODE } from 'consts/mode.const';
import { SeconderyButton, TrialButton } from 'components/atoms/Buttons';

const NewEvent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const mode = useSelector((state: RootState) => state.mode.mode);

  const [formValues, setFormValues] = useState({
    intensity: '',
    dateTime: '',
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    navigate('/destructionSites');
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
        <h1>{t('newEvent.create', { type: mode == MODE.TRIAL ? t('trial') : t('emergency') })}</h1>
      </Container>
      <Container className='form-wrapper'>
        <Form className='centered-form' onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>{t('newEvent.earthquakeMagnitude')}</Form.Label>
            <Form.Control
              type='number'
              step='0.1'
              value={formValues.intensity}
              onChange={(e) =>
                setFormValues({ ...formValues, intensity: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>{t('newEvent.earthquakeTime')}</Form.Label>
            <Form.Control
              type='datetime-local'
              value={formValues.dateTime}
              onChange={(e) =>
                setFormValues({ ...formValues, dateTime: e.target.value })
              }
            />
          </Form.Group>
          {mode == MODE.TRIAL && (
            <TrialButton onClick={generateRandomValues}>
              {t('buttons.createData')}
            </TrialButton>
          )}
          <SeconderyButton>
            {t('buttons.next')}
          </SeconderyButton>
        </Form>
      </Container>
    </>
  );
};

export default NewEvent;
