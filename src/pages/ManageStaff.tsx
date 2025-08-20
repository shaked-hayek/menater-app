import { useState, useEffect, useRef } from 'react';
import {
    Container,
    Typography,
    Modal,
    Box,
    Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StaffMember } from 'components/Interfaces/StaffMember';
import { getStaffMembersAction } from 'actions/staff/staffActions';
import { errorHandler } from 'actions/errors/errorHandler';
import { useDispatch } from 'react-redux';
import CreateStaffMember from 'components/Staff/CreateStaffMember';
import { SecondaryButton } from 'components/atoms/Buttons';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FullStaffTable from 'components/Staff/FullStaffTable';
import { staffBulkUpload } from 'actions/staff/staffBulkUpload';
import { LoadingPopup } from 'components/atoms/Popups';


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


const ManageStaff = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showLoadingPopup, setShowLoadingPopup] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('');

    const fetchStaff = async () => {
        try {
            await getStaffMembersAction(setStaffMembers);
            setShowLoadingPopup(false);
        } catch (error) {
            errorHandler(dispatch, t('manageStaff.errorMsgs.serverGetError'), error);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const onStaffCreate = (newStaff: StaffMember) => {
        setStaffMembers(prev => [...prev, newStaff]);
        setShowModal(false);
    };

    const handleDownload = () => {
        const rows = staffMembers.map(({ name, occupation, phoneNumber }) =>
            [name, occupation, phoneNumber || ''].join(',')
        );
        const csvContent = rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'staff_members.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setShowLoadingPopup(true);
            setLoadingMessage(t('manageStaff.uploading'));
            const text = await file.text();
            await staffBulkUpload(text);
            await fetchStaff();
        } catch (error) {
            errorHandler(dispatch, t('manageStaff.errorMsgs.serverAddError'), error);
        } finally {
            setShowLoadingPopup(false);
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
                    <SecondaryButton onClick={() => handleDownload()}>
                        <FileDownloadIcon color='primary' />
                    </SecondaryButton>
                    
                    <>
                        <SecondaryButton onClick={() => fileInputRef.current?.click()}>
                            <FileUploadIcon color='primary' />
                        </SecondaryButton>
                        <input
                            type='file'
                            accept='.csv'
                            hidden
                            ref={fileInputRef}
                            onChange={handleUpload}
                        />
                    </>
                </Stack>
            </Box>

            <FullStaffTable staffMembers={staffMembers} setStaffMembers={setStaffMembers} />

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={modalStyle}>
                    <CreateStaffMember onCreate={onStaffCreate} />
                </Box>
            </Modal>

            <LoadingPopup loadingMessage={loadingMessage} showLoadingPopup={showLoadingPopup} />
        </Container>
    );
};

export default ManageStaff;
