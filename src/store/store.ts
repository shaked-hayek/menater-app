import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { MODE } from 'consts/mode.const';

interface AppState {
    mode: MODE | null;
    earthquakeTime: Date | null;
    earthquakeMagnitude: number | null;
}

const initialState: AppState = {
  mode: null,
  earthquakeTime: null,
  earthquakeMagnitude: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setMode: (state, action: PayloadAction<MODE>) => {
        state.mode = action.payload;
    },
    setEarthquakeTime: (state, action: PayloadAction<Date>) => {
        state.earthquakeTime = action.payload;
    },
    setEarthquakeMagnitude: (state, action: PayloadAction<number>) => {
      state.earthquakeMagnitude = action.payload;
  },
  },
});

export const { setMode, setEarthquakeTime, setEarthquakeMagnitude } = appSlice.actions;

export const store = configureStore({
  reducer: {
    appState: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

