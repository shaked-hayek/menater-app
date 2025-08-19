import { Dispatch, SetStateAction } from 'react';
import {
    TableCell,
    TableRow,
    IconButton,
    Box,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

import { deleteNatarAction } from 'actions/natars/natarsActions';
import { Natar, NatarField } from 'components/Interfaces/Natar';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { errorHandler } from 'actions/errors/errorHandler';
import ManageTable from 'components/atoms/ManageTable';


interface FullNatarsTableProps {
    natars: Natar[];
    setNatars: Dispatch<SetStateAction<Natar[]>>;
    fields: NatarField[];
    setModalData: Dispatch<SetStateAction<Natar | undefined>>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

const FullNatarsTable = ({ natars, setNatars, fields, setModalData, setShowModal } : FullNatarsTableProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleDelete = async (natar: Natar) => {
        try {
            await deleteNatarAction(natar);
            setNatars(prev => prev.filter(n => n.id !== natar.id));
        } catch (error) {
            errorHandler(dispatch, t('manageNatars.errorMsgs.serverDeleteError'), error);
        }
    };

    const handleEdit = (natar: Natar) => {
        setModalData(natar);
        setShowModal(true);
    };

    return (
        <ManageTable
            headerFields={
                <>
                    {fields.map(field => (
                        <TableCell key={field.key} align='right' sx={{ fontWeight: 'bold' }}>
                            {field.label}
                        </TableCell>
                    ))}
                    <TableCell align='right' sx={{ fontWeight: 'bold' }}>{t('manageNatars.actions')}</TableCell>
                </>
            }
            rows={
                <>
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
                </>
            }
        />
    );
};

export default FullNatarsTable;