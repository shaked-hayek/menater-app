import { useState, useEffect } from 'react';
import { Container, Typography, Box, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ErrorPopup, LoadingPopup } from 'components/atoms/Popups';
import { Natar, getNatarTableFields } from 'components/Interfaces/Natar';
import { getOptionalNatars } from 'actions/natars/natarsActions';
import { SecondaryButton } from 'components/atoms/Buttons';
import EditNatarModal from 'components/natars/EditNatarModal';
import FullNatarsTable from 'components/natars/FullNatarsTable';


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
    const [natars, setNatars] = useState<Natar[]>([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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
                setErrorMessage(t('manageNatars.errorMsgs.serverGetError') + `\nerror: ${error}`);
                setShowErrorPopup(true);
            }
        };

        fetchNatars();
    }, []);

    const handleAdd = () => {
        // setModalData();
        // setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden'}}>
            <Box display='flex' justifyContent='space-between' alignItems='center' dir='ltr'>
                <SecondaryButton onClick={handleAdd}>
                    {t('manageNatars.addNatar')}
                </SecondaryButton>
                <Typography variant='h5' sx={{ flexGrow: 1, textAlign: 'center' }}>
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

            <ErrorPopup
                errorMessage={errorMessage}
                showErrorPopup={showErrorPopup}
                setShowErrorPopup={setShowErrorPopup}
            />
        </Container>
    );
};

export default ManageNatars;
