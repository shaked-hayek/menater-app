import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { sendErrorAction } from './errorsActions';
import { showError } from 'store/slices/errorSlice';


export const errorHandler = (dispatch: Dispatch<UnknownAction>, message: string, error?: Error) => {
    dispatch(showError({message, error}));
    sendErrorAction({message, error: error ?? null})
        .catch(() => console.log('Error in logging error to server'));
};