import React, { useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { Natar } from 'components/Interfaces/Natar';
import { SecondaryButton } from 'components/atoms/Buttons';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { useTranslation } from 'react-i18next';
import ChooseStaff from './ChooseStaff';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    height: '85%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: 'center',
};

interface AssignStaffToNatarProps {
    natar: Natar;
}

const AssignStaffToNatar = ({natar} : AssignStaffToNatarProps) => {
    const { t } = useTranslation();

    const onSubmit = () => {

    }

    return (
        <>
            <Typography variant='body1' fontWeight={'bold'}>
                {t('manageStaff.assignedStaff')}
            </Typography>
            <Box mb={2} mt={2} >
                <ColoredSideBox height='40px'>
                </ColoredSideBox>
            </Box>
            <SecondaryButton onClick={onSubmit}>{t('manageStaff.assignStaff')}</SecondaryButton>
        </>
    );
}

export default AssignStaffToNatar;