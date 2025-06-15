import { Natar } from "components/Interfaces/Natar";
import { SecondaryButton } from "components/atoms/Buttons";
import { useTranslation } from "react-i18next";

interface AssignStaffToNatarProps {
    natar: Natar;
}

const AssignStaffToNatar = ({natar} : AssignStaffToNatarProps) => {
    const { t } = useTranslation();

    const onSubmit = () => {

    }

    return (
        <>
            <SecondaryButton onClick={onSubmit}>{t('manageStaff.assignStaff')}</SecondaryButton>
        </>
    );
}

export default AssignStaffToNatar;