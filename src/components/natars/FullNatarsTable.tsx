import { Dispatch, SetStateAction, useState } from 'react';
import {
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

import { tableBgColor } from 'style/colors';
import { deleteNatarAction } from 'actions/natars/natarsActions';
import { Natar, NatarField } from 'components/Interfaces/Natar';
import { ErrorPopup } from 'components/atoms/Popups';
import { useTranslation } from 'react-i18next';


interface FullNatarsTableProps {
    natars: Natar[];
    setNatars: Dispatch<SetStateAction<Natar[]>>;
    fields: NatarField[];
    setModalData: Dispatch<SetStateAction<Natar | undefined>>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

const FullNatarsTable = ({ natars, setNatars, fields, setModalData, setShowModal } : FullNatarsTableProps) => {
    const { t } = useTranslation();
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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

    return (
        <>
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
        </>
    );
};

export default FullNatarsTable;