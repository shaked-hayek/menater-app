import { useState } from 'react';
import { Box, Container, MenuItem, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { formStyle, rtlStyle } from "style/muiStyles";
import { StaffMember, StaffOccupation } from 'components/Interfaces/StaffMember';
import { SecondaryButton } from 'components/atoms/Buttons';
import { addStaffMemberAction } from 'actions/staff/staffActions';
import { ErrorPopup } from 'components/atoms/Popups';

interface FormValues {
    name: string | null;
    occupation: string | null;
    phoneNumber?: string | null;
}

const textFieldBoxStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
};

const textFieldTypographyStyle = {
    fontWeight: 'bold', 
    whiteSpace: 'nowrap',
    minWidth: '120px',
};

interface CreateStaffMemberProps {
    onCreate?: (staffMember: StaffMember) => void;
}

const CreateStaffMember = ({ onCreate } : CreateStaffMemberProps) => {
    const { t } = useTranslation();
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const defaultFormValues = {
        name: '',
        occupation: null,
        phoneNumber: '',
    };
    const [formValues, setFormValues] = useState<FormValues>(defaultFormValues);

    const occupationOptions = [
        { value: StaffOccupation.DOCTOR, label: t('manageStaff.occupationOptions.doctor') },
        { value: StaffOccupation.PARAMEDIC, label: t('manageStaff.occupationOptions.paramedic') },
        { value: StaffOccupation.ASSISTANT, label: t('manageStaff.occupationOptions.assistant') },
    ];

    const isValidPhoneNumber = (phoneNumber: string) => {
        const phoneTrimmed = phoneNumber.trim();
        if (!phoneTrimmed) {
            return false;
        }
        const phoneNoZero = phoneTrimmed.replace(/^0+/, "") || "0";
        const phoneAsNumber = Math.floor(Number(phoneNoZero));
        return phoneAsNumber !== Infinity && String(phoneAsNumber) === phoneNoZero && phoneAsNumber >= 0;
    }

    async function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();

        if (!formValues.name || !formValues.occupation) {
            setErrorMessage(t('manageStaff.errorMsgs.fieldMissing'));
            setShowErrorPopup(true);
            return;
        }
        if (formValues.phoneNumber && !isValidPhoneNumber(formValues.phoneNumber)) {
            setErrorMessage(t('manageStaff.errorMsgs.phoneError'));
            setShowErrorPopup(true);
            return;
        }

        const staffMember = {
            name: formValues.name, 
            occupation: formValues.occupation,
            status: 'null',
            phoneNumber: formValues.phoneNumber ?? '',
            natarId: 0,
        };
        try {
            await addStaffMemberAction(staffMember as StaffMember);
        } catch (error) {
            setErrorMessage(t('manageStaff.errorMsgs.serverAddError'));
            setShowErrorPopup(true);
            return;
        }
        if (onCreate) {
            onCreate(staffMember as StaffMember);
        }
        setFormValues(defaultFormValues);
    };
    
    return (
        <Container>
            <Box>
                <Typography variant='h5'>{t('manageStaff.addStaffMember')}</Typography>
            </Box>
            <Box sx={formStyle}>
                <Box sx={textFieldBoxStyle}>
                    <Typography sx={textFieldTypographyStyle}>{t('manageStaff.staffName')}</Typography>
                    <TextField
                        variant='outlined'
                        type='string'
                        value={formValues.name}
                        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                        fullWidth
                        sx={rtlStyle}
                    />
                </Box>

                <Box sx={textFieldBoxStyle}>
                    <Typography sx={textFieldTypographyStyle}>{t('manageStaff.staffOccupation')}</Typography>
                    <TextField
                        select
                        variant='outlined'
                        type='string'
                        value={formValues.occupation}
                        onChange={(e) => setFormValues({ ...formValues, occupation: e.target.value })}
                        fullWidth
                        sx={{
                            ...rtlStyle,
                            width: '210px', // TODO: change hardcoded size
                        }}
                    >
                        {occupationOptions.map((option) => (
                            <MenuItem key={option.value} value={option.label}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={textFieldBoxStyle}>
                    <Typography sx={textFieldTypographyStyle}>{t('manageStaff.staffPhone')}</Typography>
                    <TextField
                        variant='outlined'
                        type='string'
                        value={formValues.phoneNumber}
                        onChange={(e) => setFormValues({ ...formValues, phoneNumber: e.target.value })}
                        fullWidth
                        sx={rtlStyle}
                    />
                </Box>
            </Box>

            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <SecondaryButton onClick={handleSubmit}>{t('buttons.add')}</SecondaryButton>
            </Box>
            
            <ErrorPopup errorMessage={errorMessage} showErrorPopup={showErrorPopup} setShowErrorPopup={setShowErrorPopup} />
        </Container>
    );
};

export default CreateStaffMember;
