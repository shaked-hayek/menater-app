import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Paper,
  TableContainer,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ErrorPopup } from 'components/atoms/Popups';
import { Natar, getNatarTableFields } from 'components/Interfaces/Natar';
import { getOptionalNatars, editNatarAction, deleteNatarAction } from 'actions/natars/natarsActions';
import { SecondaryButton } from 'components/atoms/Buttons';
import { tableBgColor } from 'style/colors';

const ManageNatars = () => {
    const { t } = useTranslation();
    const [natars, setNatars] = useState<Natar[]>([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<Partial<Natar>>({});

    const fields = getNatarTableFields(t);

    useEffect(() => {
        const fetchNatars = async () => {
            try {
                await getOptionalNatars(setNatars);
            } catch (error) {
                setErrorMessage(t('manageNatars.errorMsgs.serverGetError'));
                setShowErrorPopup(true);
            }
        };

        fetchNatars();
    }, []);

    const handleDelete = async (natar: Natar) => {
        try {
            await deleteNatarAction(natar);
            setNatars(prev => prev.filter(n => n.id !== natar.id));
        } catch (error) {
            setErrorMessage(t('manageNatars.errorMsgs.serverDeleteError'));
            setShowErrorPopup(true);
        }
    };

    const handleEdit = (natar: Natar) => {
        setModalData(natar);
        setShowModal(true);
    };

    const handleAdd = () => {
        setModalData({});
        setShowModal(true);
    };

    const handleModalSave = async () => {
        try {
            if (modalData.name) {
                await editNatarAction(modalData as Natar);
                await getOptionalNatars(setNatars);
            }
            setShowModal(false);
        } catch (error) {
            setErrorMessage(t('manageNatars.errorMsgs.serverEditError'));
            setShowErrorPopup(true);
        }
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden'}}>
            <Box display='flex' justifyContent='space-between' alignItems='center' dir='ltr'>
                <SecondaryButton onClick={handleAdd}>
                    {t('manageNatars.addNatar')}
                </SecondaryButton>
                <Typography variant='h5' sx={{ flexGrow: 1, textAlign: 'center' }}>
                    {t('manageNatars.existingNatars')}
                </Typography>
                <Box width='135px' />
            </Box>

            <Paper
                elevation={2}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: tableBgColor,
                }}
            >
                <TableContainer sx={{ maxHeight: '445px' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {fields.map(field => (
                                    <TableCell key={field.key} align='right' sx={{ fontWeight: 'bold' }}>
                                        {field.label}
                                    </TableCell>
                                ))}
                                <TableCell align='right' sx={{ fontWeight: 'bold' }}>{t('manageNatars.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {natars.map(natar => (
                                <TableRow key={natar.id}>
                                    {fields.map(({ key }) =>
                                        <TableCell key={key} align='right'>
                                            {typeof natar[key] === 'boolean'
                                            ? t(natar[key] ? 'openNatar.exists' : 'openNatar.doesntExist')
                                            : String(natar[key] ?? '')}
                                        </TableCell>
                                    )}
                                    <TableCell align='right'>
                                        <Box display='flex' gap={1} justifyContent='flex-end'>
                                            <IconButton onClick={() => handleEdit(natar)}>
                                                <Edit color='primary' />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(natar)}>
                                                <Delete color='error' />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <ErrorPopup
                errorMessage={errorMessage}
                showErrorPopup={showErrorPopup}
                setShowErrorPopup={setShowErrorPopup}
            />
        </Container>
    );
};

export default ManageNatars;
