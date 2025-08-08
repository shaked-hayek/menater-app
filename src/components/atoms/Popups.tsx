import { Box, Button, Dialog, DialogActions, DialogTitle, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CircularProgress } from '@mui/material';


interface ErrorPopupProps {
    errorMessage: string;
    error?: Error | null;
    showErrorPopup: boolean;
    onClose: () => void;
}

export const ErrorPopup = ({ errorMessage, error, showErrorPopup, onClose } : ErrorPopupProps) => {
    const { t } = useTranslation();
    
    return (
        <Dialog open={showErrorPopup} onClose={onClose}>
            <DialogTitle>{errorMessage}</DialogTitle>
            {error && 
                <Typography variant='body2'>
                    {error.message}
                </Typography>
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

