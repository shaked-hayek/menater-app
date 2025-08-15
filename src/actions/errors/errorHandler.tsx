import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { sendErrorAction } from './errorsActions';
import { showError } from 'store/slices/errorSlice';


export interface SerializedError {
    name: string;
    message: string;
    stack?: string;
    details?: unknown; // optional, for ArcGIS-specific properties
}


export const serializeError = (error: unknown): SerializedError | null => {
    if (!error || typeof error !== 'object') return null;

    const err = error as { name?: string; message?: string; stack?: string; details?: any };

    // Remove non-serializable fields like ESRI layer instances
    let cleanDetails: any = undefined;

    if (err.details && typeof err.details === 'object') {
        const { layer, ...rest } = err.details;
        cleanDetails = rest;

        // Optionally keep just layer info
        if (layer && layer.title) {
            cleanDetails.layerTitle = layer.title;
        }
    }

    return {
        name: err.name || 'UnknownError',
        message: err.message || 'An error occurred',
        stack: err.stack,
        details: cleanDetails,
    };
};
  

export const errorHandler = (
    dispatch: Dispatch<UnknownAction> | null,
    message: string,
    error?: any,
) => {
    const serializedError = serializeError(error);

    if (dispatch) {
        dispatch(showError({message: message ?? 'Error occurred', error: serializedError}));
    }
    sendErrorAction({ message: message ?? 'Error occurred', error: serializedError })
        .catch(() => console.log('Error in logging error to server'));
};