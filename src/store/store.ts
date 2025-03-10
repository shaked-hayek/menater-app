import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { MODE } from "consts/mode.const";

interface ModeState {
    mode: MODE;
}

const modeSlice = createSlice({
  name: "mode",
  initialState: { mode: MODE.TRIAL } as ModeState,
  reducers: {
    setMode: (state, action: PayloadAction<MODE>) => {
        state.mode = action.payload;
    },
  },
});

export const { setMode } = modeSlice.actions;

export const store = configureStore({
  reducer: {
    mode: modeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

