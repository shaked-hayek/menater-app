import { useState } from 'react';
import { Box, FormControl, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Natar, NatarField } from 'components/Interfaces/Natar';
import { useTranslation } from 'react-i18next';
import { formStyle, rtlStyle } from 'style/muiStyles';
import { SecondaryButton } from 'components/atoms/Buttons';
import { editNatarAction } from 'actions/natars/natarsActions';
import { errorHandler } from 'actions/errors/errorHandler';
import { useDispatch } from 'react-redux';


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

const fieldStyle = {
    ...rtlStyle,
    minWidth: '300px',
};

interface EditNatarModalProps {
    natar: Natar;
    fields: NatarField[];
    onClose: () => void;
}

const EditNatarModal = ({ natar, fields, onClose } : EditNatarModalProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [editedNatar, setEditedNatar] = useState<Natar>(natar);

    const editFields = fields.filter(field => field.key !== 'id');

    const onFieldChange = (fieldKey: keyof Natar, fieldValue: any) => {
        setEditedNatar({ ...editedNatar, [fieldKey]: fieldValue });
    };

    const handleSubmit = async () => {
        try {
            await editNatarAction(editedNatar);
        } catch (error) {
            errorHandler(dispatch, t('manageNatars.errorMsgs.serverGetError'), error);
        }
        onClose();
    }

    const renderField = (field: NatarField) => {
        if (typeof natar[field.key] === 'boolean') {
            return (
                <FormControl fullWidth sx={fieldStyle}>
                    <Select
                        value={editedNatar[field.key]}
                        onChange={(e) => onFieldChange(field.key, e.target.value === 'true')}
                        variant='outlined'
                    >
                        <MenuItem value='true'>{t('openNatar.exists')}</MenuItem>
                        <MenuItem value='false'>{t('openNatar.doesntExist')}</MenuItem>
                    </Select>
                </FormControl>
            );
        }

        return (
            <TextField
                fullWidth
                variant='outlined'
                value={editedNatar[field.key]?.toString() || ''}
                onChange={(e) => onFieldChange(field.key, e.target.value)}
                sx={fieldStyle}
            />
        );
    };

    return (
        <>
            <Box sx={{ position: 'absolute', top: 1, right: 1 }}>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant='h5' sx={{ flexGrow: 1, textAlign: 'center' }}>
                    {t('manageNatars.editNatar')}
                </Typography>
                <SecondaryButton onClick={handleSubmit}>
                    {t('buttons.submit')}
                </SecondaryButton>
            </Box>
            <Box sx={{...formStyle, overflowY: 'auto', maxHeight: '80vh', alignItems: 'center'}}>
                {editFields.map(field => (
                    <Box key={field.key} sx={textFieldBoxStyle}>
                        <Typography sx={textFieldTypographyStyle}>{field.label}</Typography>
                        {renderField(field)}
                    </Box>
                ))}
            </Box>
        </>
    );
};

export default EditNatarModal;