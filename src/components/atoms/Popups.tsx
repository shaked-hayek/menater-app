import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";


interface ErrorPopupProps {
    errorMessage: string;
    showErrorPopup: boolean;
    setShowErrorPopup: (showErrorPopup: boolean) => void;
}

export const ErrorPopup = ({ errorMessage, showErrorPopup, setShowErrorPopup } : ErrorPopupProps) => {
    const { t } = useTranslation();
    
    return (
        <Dialog open={showErrorPopup} onClose={() => setShowErrorPopup(false)}>
            <DialogTitle>{errorMessage}</DialogTitle>
            <DialogActions>
                <Button onClick={() => setShowErrorPopup(false)} color='primary'>
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
                    {t('buttons.edit')}
                </Button>
                <Button onClick={onApprove} color='primary'>
                    {t('buttons.submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

