import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { MODE } from 'consts/mode.const';
import { useDispatch } from 'react-redux';

interface AppState {
  arcgisAuth: boolean | null;
  mode: MODE | null;
  earthquakeTime: Date | null;
  earthquakeMagnitude: number | null;
  eventId: string | null;
}

const initialState: AppState = {
  arcgisAuth: null,
  mode: null,
  earthquakeTime: null,
  earthquakeMagnitude: null,
  eventId: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setArcgisAuth: (state, action: PayloadAction<boolean>) => {
      state.arcgisAuth = action.payload;
    },
    setMode: (state, action: PayloadAction<MODE>) => {
        state.mode = action.payload;
    },
    setEarthquakeTime: (state, action: PayloadAction<Date>) => {
        state.earthquakeTime = action.payload;
    },
    setEarthquakeMagnitude: (state, action: PayloadAction<number>) => {
      state.earthquakeMagnitude = action.payload;
    },
    setEventId: (state, action: PayloadAction<string>) => {
      state.eventId = action.payload;
    },
  },
});

export const { setArcgisAuth, setMode, setEarthquakeTime, setEarthquakeMagnitude, setEventId } = appSlice.actions;

export const store = configureStore({
  reducer: {
    appState: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
