import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Typography, TextField } from '@mui/material';
import { DateTimeField, DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import { SeconderyButton, CreateDataButton } from 'components/atoms/Buttons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { MODE } from 'consts/mode.const';
import { setEarthquakeMagnitude, setEarthquakeTime } from 'store/store';

const rtlStyle = {
  '& label': {
    left: 'unset',
    right: '1.75rem',
    transformOrigin: 'right',
  },
  '& legend': {
    textAlign: 'right',
  },
};

interface FormValues {
  magnitude: number;
  dateTime: Dayjs | null;
}

const NewEvent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.appState.mode);

  const [formValues, setFormValues] = useState<FormValues>({
    magnitude: 0,
    dateTime: dayjs(),
  });

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!formValues.dateTime) {
      console.error('DateTime is missing');
      return;
    }

    dispatch(setEarthquakeMagnitude(formValues.magnitude));
    dispatch(setEarthquakeTime(formValues.dateTime.toDate()));
    navigate('/destructionSites');
  };

  const generateRandomValues = () => {
    const randomIntensity = parseFloat((Math.random() * 10).toFixed(1));

  const randomDateTime = dayjs()
    .subtract(Math.floor(Math.random() * 10), 'day')
    .subtract(Math.floor(Math.random() * 24), 'hour')
    .subtract(Math.floor(Math.random() * 60), 'minute')

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          p: '2rem',
          gap: '1rem',
        }}
      >
        {/* Earthquake Magnitude */}
        <Typography sx={{ fontWeight: 'bold' }}>{t('newEvent.earthquakeMagnitude')}</Typography>
        <TextField
          variant='outlined'
          type='number'
          value={formValues.magnitude}
          onChange={(e) => setFormValues({ ...formValues, magnitude: parseFloat(e.target.value) })}
          fullWidth
          sx={rtlStyle}
        />

        {/* Earthquake Date & Time */}
        <Typography sx={{ fontWeight: 'bold' }}>{t('newEvent.earthquakeTime')}</Typography>
        <DateTimePicker
          value={formValues.dateTime}
          onChange={(newValue) => setFormValues({ ...formValues, dateTime: newValue })}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingTop: '1rem' }}>
          {mode == MODE.TRIAL && (
            <CreateDataButton onClick={generateRandomValues}>{t('buttons.createData')}</CreateDataButton>
          )}
          <SeconderyButton onClick={handleSubmit}>{t('buttons.next')}</SeconderyButton>
        </Box>
      </Box>
    </>
  );
};

export default NewEvent;
