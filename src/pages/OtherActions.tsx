import { Box, Typography } from '@mui/material';
import { SecondaryButton } from 'components/atoms/Buttons';
import { ErrorPopup, LoadingPopup } from 'components/atoms/Popups';
import { useState } from 'react';
import { useTranslation } from "react-i18next";


const buttonsStyle = {
    p: 2,
    m: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
}

const OtherActions = () => {
    const { t } = useTranslation();

    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoadingPopup, setShowLoadingPopup] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    return (
        <>
            <Box sx={buttonsStyle}>
                <SecondaryButton onClick={() => {}}>
                    {t('otherActions.showErrors')}
                </SecondaryButton>

                <Box m={2} sx={buttonsStyle}>
                    <Typography variant='body1' >
                        {t('otherActions.initWarning')}
                    </Typography>
                    <SecondaryButton onClick={() => {}}>
                        {t('otherActions.initSystem')}
                    </SecondaryButton>
                </Box>
            </Box>

            <ErrorPopup errorMessage={errorMessage} showErrorPopup={showErrorPopup} setShowErrorPopup={setShowErrorPopup} />

            <LoadingPopup loadingMessage={loadingMessage} showLoadingPopup={showLoadingPopup} />
        </>
    );
};

export default OtherActions;