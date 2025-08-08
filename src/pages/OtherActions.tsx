import { Box, Typography } from '@mui/material';
import { getErrorsAction } from 'actions/errors/errorsActions';
import { initializeDBAction } from 'actions/serverDB/serverDBActions';
import { SecondaryButton } from 'components/atoms/Buttons';
import { ApprovePopup, ErrorPopup, LoadingPopup } from 'components/atoms/Popups';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateTimeForFileName } from 'utils';
import { errorRed } from 'style/colors';


const buttonsStyle = {
    p: 2,
    m: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center',
    textAlign: 'center',
}

const OtherActions = () => {
    const { t } = useTranslation();

    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoadingPopup, setShowLoadingPopup] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [showApprovePopup, setShowApprovePopup] = useState(false);


    const downloadErrorsFile = async () => {
        try {
            const errorsList = await getErrorsAction();

            const blob = new Blob([JSON.stringify(errorsList, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const timestamp = formatDateTimeForFileName(new Date());
            const filename = `errors-list_${timestamp}.json`;

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            setErrorMessage(t('otherActions.errorMsgs.serverGetError'));
            setShowErrorPopup(true);
        }
    };

    const initSystemAction = async () => {
        try {
            setShowLoadingPopup(true);
            setLoadingMessage(t('otherActions.loadingInit'));
            await initializeDBAction();
            setShowLoadingPopup(false);
        } catch (error) {
            setErrorMessage(t('otherActions.errorMsgs.serverGetError'));
            setShowErrorPopup(true);
        }
    };

    return (
        <>
            <Box sx={buttonsStyle}>
                <SecondaryButton onClick={downloadErrorsFile}>
                    {t('otherActions.showErrors')}
                </SecondaryButton>

                <Box m={2} sx={buttonsStyle}>
                    <Typography variant='body1' color={errorRed}>
                        {t('otherActions.initWarning')}
                    </Typography>
                    <SecondaryButton onClick={() => setShowApprovePopup(true)}>
                        {t('otherActions.initSystem')}
                    </SecondaryButton>
                </Box>
            </Box>

            <ErrorPopup errorMessage={errorMessage} showErrorPopup={showErrorPopup} setShowErrorPopup={setShowErrorPopup} />

            <LoadingPopup loadingMessage={loadingMessage} showLoadingPopup={showLoadingPopup} />

            <ApprovePopup
                message={t('otherActions.initApprove')}
                showPopup={showApprovePopup}
                setShowPopup={setShowApprovePopup}
                onApprove={initSystemAction}
                onReject={() => setShowApprovePopup(false)}
            />
        </>
    );
};

export default OtherActions;
