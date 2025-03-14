import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, TextField, Typography } from '@mui/material';

import { SeconderyButton, CreateDataButton } from 'components/atoms/Buttons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { MODE } from 'consts/mode.const';
import { setEarthquakeMagnitude, setEarthquakeTime } from 'store/store';
import { LANGUAGES } from 'consts/languages.const';

const rtlStyle = {
  "& label": {
    left: "unset",
    right: "1.75rem",
    transformOrigin: "right",
  },
  "& legend": {
    textAlign: "right",
  },
}

interface FormValues {
  magnitude: number;
  dateTime: string;
}


const NewEvent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.appState.mode);

  const dateToString = (date: Date) => {
    return date.toLocaleString(LANGUAGES.HE);
  };

  const [formValues, setFormValues] = useState<FormValues>({
    magnitude: 0,
    dateTime: dateToString(new Date(Date.now())),
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    dispatch(setEarthquakeMagnitude(formValues.magnitude));
    dispatch(setEarthquakeTime(new Date(formValues.dateTime)));
    navigate('/destructionSites');
  };

  const generateRandomValues = () => {
    const randomIntensity = parseFloat((Math.random() * 10).toFixed(1));
    const randomDateTime = dateToString(new Date(
      Date.now() + Math.floor(Math.random() * 10000000000)
    ));

    setFormValues({
      magnitude: randomIntensity,
      dateTime: randomDateTime,
    });
  };

  return (
    <>
      <Box>
        <Typography variant='h4'>
          {t('newEvent.create', { type: mode == MODE.TRIAL ? t('trial') : t('emergency') })}
        </Typography>
      </Box>
      <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          p: '2rem', 
          gap: '1rem'
        }}>

        {/* Earthquake Magnitude */}
        <TextField
          variant="filled"
          label={t('newEvent.earthquakeMagnitude')}
          type='number'
          value={formValues.magnitude}
          onChange={(v) => setFormValues({ ...formValues, magnitude: parseFloat(v.target.value) })}
          fullWidth
          slotProps={{ 
            htmlInput: { step: 0.1 }, 
          }}
          sx={rtlStyle}
        />

        {/* Earthquake Time */}
        <TextField
          variant="filled"
          label={t('newEvent.earthquakeTime')}
          type='datetime-local'
          value={formValues.dateTime}
          onChange={(v) => setFormValues({ ...formValues, dateTime: v.target.value })}
          fullWidth
          sx={rtlStyle}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingTop: '1rem' }}>
          {mode == MODE.TRIAL && (
            <CreateDataButton onClick={generateRandomValues}>
              {t('buttons.createData')}
            </CreateDataButton>
          )}
          <SeconderyButton onClick={handleSubmit}>
            {t('buttons.next')}
          </SeconderyButton>
        </Box>
      </Box>
    </>
  );
};

export default NewEvent;
