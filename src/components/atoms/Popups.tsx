import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CircularProgress } from '@mui/material';
import { rtlStyle } from 'style/muiStyles';


interface ErrorPopupProps {
    errorMessage: string;
    errorMessageOriginal: string | null;
    showErrorPopup: boolean;
    onClose: () => void;
}

export const ErrorPopup = ({ errorMessage, errorMessageOriginal, showErrorPopup, onClose } : ErrorPopupProps) => {
    const { t } = useTranslation();
    
    return (
        <Dialog open={showErrorPopup} onClose={onClose}>
            <DialogTitle>{errorMessage}</DialogTitle>
            {errorMessageOriginal && 
                <Box textAlign='center'>
                    <Typography variant='body2'>
                        {errorMessageOriginal}
                    </Typography>
                </Box>
            }
            <DialogActions>
                <Button onClick={onClose} color='primary'>
                    {t('buttons.submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface ApprovePopupProps {
    message: string;
    showPopup: boolean;
    setShowPopup: (showPopup: boolean) => void;
    onApprove: () => void;
    onReject: () => void;
}

export const ApprovePopup = ({ message, showPopup, setShowPopup, onApprove, onReject } : ApprovePopupProps) => {
    const { t } = useTranslation();

    return (
        <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
            <DialogTitle>{message}</DialogTitle>
            <DialogActions>
                <Button onClick={onReject} color='error'>
                    {t('buttons.cancel')}
                </Button>
                <Button onClick={onApprove} color='primary'>
                    {t('buttons.submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};


interface ApprovePopupWithCodeProps {
    message: string;
    showPopup: boolean;
    setShowPopup: (show: boolean) => void;
    onApprove: () => void;
    onReject: () => void;
    correctCode: string;
}

export const ApprovePopupWithCode = ({
    message,
    showPopup,
    setShowPopup,
    onApprove,
    onReject,
    correctCode,
}: ApprovePopupWithCodeProps) => {
    const { t } = useTranslation();
    const [inputCode, setInputCode] = useState('');

    const handleClose = () => {
        setInputCode('');
        setShowPopup(false);
    };

    const isCodeCorrect = inputCode === correctCode;

    return (
        <Dialog open={showPopup} onClose={handleClose}>
            <DialogTitle>{message}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    label={t('otherActions.enterCode')}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    variant='outlined'
                    type='password'
                    margin='dense'
                    sx={rtlStyle}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { handleClose(); onReject(); }} color='error'>
                    {t('buttons.cancel')}
                </Button>
                <Button
                    onClick={() => { handleClose(); onApprove(); }}
                    color='primary'
                    disabled={!isCodeCorrect}
                >
                    {t('buttons.submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};


interface LoadingPopupProps {
    loadingMessage: string;
    showLoadingPopup: boolean;
}

export const LoadingPopup = ({loadingMessage, showLoadingPopup} : LoadingPopupProps) => {
    const { t } = useTranslation();
    
    return (
        <Dialog open={showLoadingPopup}>
            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                padding={4}
            >
                <CircularProgress size={40} thickness={4} color='primary' />
                <DialogTitle>{loadingMessage}</DialogTitle>
            </Box>
        </Dialog>
    );
};

