import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { EarthquakeEvent } from 'components/Interfaces/EarthquakeEvent';
import errorReducer from './slices/errorSlice';
import { MODE } from 'consts/mode.const';

interface AppState {
  arcgisAuth: boolean | null;
  mode: MODE | null;
  earthquakeEvent: EarthquakeEvent | null;
  displayEventId: number | null;
}

const initialState: AppState = {
  arcgisAuth: null,
  mode: null,
  earthquakeEvent: null,
  displayEventId: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setArcgisAuth: (state, action: PayloadAction<boolean>) => {
      state.arcgisAuth = action.payload;
    },
    setEarthquakeEvent: (state, action: PayloadAction<EarthquakeEvent | null>) => {
      state.earthquakeEvent = action.payload;
    },
    setMode: (state, action: PayloadAction<MODE>) => {
        state.mode = action.payload;
    },
    setDisplayEventId: (state, action: PayloadAction<number | null>) => {
      state.displayEventId = action.payload;
    },
  },
});

export const { setArcgisAuth, setMode, setEarthquakeEvent, setDisplayEventId } = appSlice.actions;

export const store = configureStore({
  reducer: {
    appState: appSlice.reducer,
    error: errorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
