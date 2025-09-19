import { useState, useEffect } from 'react';
import { Container, Typography, Box, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LoadingPopup } from 'components/atoms/Popups';
import { Natar, getNatarTableFields } from 'components/Interfaces/Natar';
import { getOptionalNatars } from 'actions/natars/natarsActions';
import { SecondaryButton } from 'components/atoms/Buttons';
import EditNatarModal from 'components/Natars/EditNatarModal';
import FullNatarsTable from 'components/Natars/FullNatarsTable';
import { useDispatch } from 'react-redux';
import { errorHandler } from 'actions/errors/errorHandler';
import DownloadIcon from '@mui/icons-material/Download';


const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '85%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: 'center',
};

const ManageNatars = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [natars, setNatars] = useState<Natar[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<Natar>();
    const [showLoadingPopup, setShowLoadingPopup] = useState(true);

    const fields = getNatarTableFields(t);

    useEffect(() => {
        const fetchNatars = async () => {
            setShowLoadingPopup(true);
            try {
                await getOptionalNatars(setNatars);
                setShowLoadingPopup(false);
            } catch (error) {
                setShowLoadingPopup(false);
                errorHandler(dispatch, t('manageNatars.errorMsgs.serverGetError'), error);
            }
        };

        fetchNatars();
    }, []);

    const closeModal = () => {
        setShowModal(false);
    }

    const handleDownloadCSV = () => {
        if (!natars.length) return;

        // Extract column headers (using translated field names)
        const headers = fields.map(field => field.label);

        // Extract rows
        const rows = natars.map(natar =>
            fields.map(field => {
                const value = (natar as any)[field.key];
                return typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value);
            })
        );

        // Build CSV string
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        // Trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'natarsList.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden'}}>
            <Box display='flex' justifyContent='space-between' alignItems='center' dir='ltr'>
                <SecondaryButton onClick={handleDownloadCSV}>
                    <DownloadIcon color='primary' />
                </SecondaryButton>
                <Typography variant='h4' sx={{ flexGrow: 1, textAlign: 'center' }}>
                    {t('manageNatars.existingNatars')}
                </Typography>
            </Box>

            <FullNatarsTable
                natars={natars}
                setNatars={setNatars}
                fields={fields}
                setModalData={setModalData}
                setShowModal={setShowModal}
            />

            <Modal open={showModal} onClose={closeModal}>
                <Box sx={modalStyle}>
                    {modalData &&
                        <EditNatarModal natar={modalData} fields={fields} onClose={closeModal} />
                    }
                </Box>
            </Modal>

            <LoadingPopup loadingMessage={t('manageNatars.gettingNatars')} showLoadingPopup={showLoadingPopup} />

        </Container>
    );
};

export default ManageNatars;
