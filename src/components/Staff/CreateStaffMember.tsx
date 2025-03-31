import { useState } from 'react';
import { Box, Container, MenuItem, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { formStyle, rtlStyle } from "style/muiStyles";
import { StaffOccupation, StaffMember } from 'pages/ManageStaff';
import { SecondaryButton } from 'components/atoms/Buttons';
import { addStaffMemberAction } from 'actions/staff/staffActions';

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

const CreateStaffMember = () => {
    const { t } = useTranslation();
    const [formValues, setFormValues] = useState<FormValues>({
        name: null,
        occupation: null,
        phoneNumber: null,
      });

    const occupationOptions = [
        { value: StaffOccupation.DOCTOR, label: t('manageStaff.occupationOptions.doctor') },
        { value: StaffOccupation.PARAMEDIC, label: t('manageStaff.occupationOptions.paramedic') },
        { value: StaffOccupation.ASSISTANT, label: t('manageStaff.occupationOptions.assistant') },
    ];

    async function handleSubmit(e: { preventDefault: () => void }) {
        console.log(formValues);
        e.preventDefault();

        if (!formValues.name || !formValues.occupation) {
            console.error('Name or Occupation is missing'); // TODO: Show error
            return;
        }
        // TODO: Verify phone number
        const staffMember = {
            name: formValues.name, 
            occupation: formValues.occupation,
            status: 'null', // TODO: change
            phoneNumber: formValues.phoneNumber,
        };
        await addStaffMemberAction(staffMember as StaffMember);
        window.location.reload();    
    };
    
    return (
        <Container>
            <Box>
                <Typography variant='h4'>{t('manageStaff.addStaffMember')}</Typography>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <SecondaryButton onClick={handleSubmit}>{t('buttons.submit')}</SecondaryButton>
            </Box>
        </Container>
    );
};

export default CreateStaffMember;
