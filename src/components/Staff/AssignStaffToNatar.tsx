import { Box, Typography } from '@mui/material';
import { Natar } from 'components/Interfaces/Natar';
import { SecondaryButton } from 'components/atoms/Buttons';
import ColoredSideBox from 'components/atoms/ColoredSideBox';
import { useTranslation } from 'react-i18next';

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