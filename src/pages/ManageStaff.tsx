import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    IconButton,
    Modal,
    Box,
    TableCell,
    TableRow,
    Stack,
    TextField,
    TableSortLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

import { StaffMember } from 'components/Interfaces/StaffMember';
import { deleteStaffMemberAction, getStaffMembersAction } from 'actions/staff/staffActions';
import { errorHandler } from 'actions/errors/errorHandler';
import { useDispatch } from 'react-redux';
import CreateStaffMember from 'components/Staff/CreateStaffMember';
import { SecondaryButton } from 'components/atoms/Buttons';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ManageTable from 'components/atoms/ManageTable';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    minWidth: 400,
};

const headerCellStyle = {
    fontWeight: 'bold',
}

type SortField = keyof StaffMember;


const ManageStaff = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
    const [searchName, setSearchName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


    useEffect(() => {
        const fetchStaff = async () => {
            try {
                await getStaffMembersAction(setStaffMembers);
            } catch (error) {
                errorHandler(dispatch, t('manageStaff.errorMsgs.serverGetError'), error);
            }
        };

        fetchStaff();
    }, []);

    useEffect(() => {
        let filtered = staffMembers.filter(member =>
            member.name.toLowerCase().includes(searchName.toLowerCase())
        );

        filtered.sort((a, b) => {
            const aVal = a[sortField] || '';
            const bVal = b[sortField] || '';
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredStaff(filtered);
    }, [searchName, staffMembers, sortField, sortDirection]);

    async function deleteStaffMember(staffMember: StaffMember) {
        try {
            await deleteStaffMemberAction(staffMember);
        } catch (error) {
            errorHandler(dispatch, t('manageStaff.errorMsgs.serverDeleteError'), error);
            return;
        }
        setStaffMembers(prev =>
            prev.filter(member => member.name !== staffMember.name)
        );
    }

    const onStaffCreate = (newStaff: StaffMember) => {
        setStaffMembers(prev => [...prev, newStaff]);
        setShowModal(false);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden'}}>
            <Box display='flex' justifyContent='space-between' alignItems='center' dir='ltr'>
                <SecondaryButton onClick={() => setShowModal(true)}>
                    {t('manageStaff.addStaffMember')}
                </SecondaryButton>

                <Typography variant='h4' sx={{ flexGrow: 1, textAlign: 'center' }}>
                    {t('manageStaff.title')}
                </Typography>

                <Stack direction='row' spacing={1}>
                    <SecondaryButton onClick={() => {}}>
                        <FileDownloadIcon color='primary' />
                    </SecondaryButton>
                    <SecondaryButton onClick={() => {}}>
                        <FileUploadIcon color='primary' />
                    </SecondaryButton>
                </Stack>
            </Box>

            <TextField
                fullWidth
                variant='outlined'
                size='small'
                placeholder={t('manageStaff.searchByName')}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                sx={{ mt: 2 }}
            />

            <ManageTable
                maxHeight='400px'
                headerFields={
                    <>
                        <TableCell align='right' sx={headerCellStyle}>
                            <TableSortLabel
                                active={sortField === 'name'}
                                direction={sortField === 'name' ? sortDirection : 'asc'}
                                onClick={() => handleSort('name')}
                            >
                                {t('manageStaff.staffName')}
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align='right' sx={headerCellStyle}>
                            <TableSortLabel
                                active={sortField === 'occupation'}
                                direction={sortField === 'occupation' ? sortDirection : 'asc'}
                                onClick={() => handleSort('occupation')}
                            >
                                {t('manageStaff.staffOccupation')}
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align='right' sx={headerCellStyle}>
                            <TableSortLabel
                                active={sortField === 'phoneNumber'}
                                direction={sortField === 'phoneNumber' ? sortDirection : 'asc'}
                                onClick={() => handleSort('phoneNumber')}
                            >
                                {t('manageStaff.staffPhone')}
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 'bold', padding: '0 8px' }}>
                            {t('manageStaff.deleteStaff')}
                        </TableCell>
                    </>
                }
                rows={
                    filteredStaff.length > 0 ? (
                        <>
                            {filteredStaff.map((staff, index) => (
                                <TableRow key={index}>
                                    <TableCell align='right'>{staff.name}</TableCell>
                                    <TableCell align='right'>{staff.occupation}</TableCell>
                                    <TableCell align='right'>{staff.phoneNumber || '-'}</TableCell>
                                    <TableCell align='right' sx={{ padding: '0 8px' }}>
                                        <IconButton onClick={() => deleteStaffMember(staff)}>
                                            <DeleteIcon color='error' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    ) : (
                        // 👇 No Rows Fallback
                        <TableRow>
                            <TableCell colSpan={4} align='center'>
                                {t('manageStaff.noRowsFound')}
                            </TableCell>
                        </TableRow>
                    )
                }
            />

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={modalStyle}>
                    <CreateStaffMember onCreate={onStaffCreate} />
                </Box>
            </Modal>
        </Container>
    );
};

export default ManageStaff;
