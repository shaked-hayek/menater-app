import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface ErrorState {
    message: string;
    error: Error | null;
    visible: boolean;
}

const initialState: ErrorState = {
    message: '',
    error: null,
    visible: false,
};

interface ShowErrorPayload {
    message: string;
    error?: Error | null;
}

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        showError: (state, action: PayloadAction<ShowErrorPayload>) => {
            state.message = action.payload.message;
            state.error = action.payload.error ?? null;
            state.visible = true;
        },
        hideError: (state) => {
            state.visible = false;
            state.error = null;
        },
    },
});

export const { showError, hideError } = errorSlice.actions;
export default errorSlice.reducer;
