import { Typography } from "@mui/material";
import { Natar } from "components/Interfaces/Natar";
import { useTranslation } from "react-i18next";

interface ChooseStaffProps {
    natar: Natar;
    onClose: () => void;
}

const ChooseStaff = ({natar, onClose} : ChooseStaffProps) => {
    const { t } = useTranslation();

    return (
        <>
            <Typography variant="body1">{t('manageStaff.chooseStaff', {natar: natar.name})}</Typography>
        </>
    );
};

export default ChooseStaff;