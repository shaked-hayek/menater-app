import { IconButton, List, ListItem, ListItemText } from '@mui/material';
import { mainNatarColor, secondaryNatarColor } from 'style/colors';
import AddIcon from '@mui/icons-material/Add';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { buildNestedNatars } from 'utils';
import { Natar } from '../Interfaces/Natar';
import { NATAR_TYPE } from 'consts/natarType.const';

interface NatarNestedListProps {
    recommendedNatars: Natar[];
    openNatar: (natar: Natar) => void;
}

const NatarNestedList = ({recommendedNatars, openNatar} : NatarNestedListProps) => {
    return (
        <List>
            {buildNestedNatars(recommendedNatars).map((natar, index) => {
                const isChild = natar.type == NATAR_TYPE.SECONDARY;
                const iconStyle = {color: isChild ? secondaryNatarColor : mainNatarColor};

                return (
                    <ListItem
                        key={index}
                        disableGutters
                        sx={{ mr: isChild ? 4 : 0 }} // indent child natars
                        secondaryAction={
                            <IconButton edge='start' onClick={() => openNatar(natar)}>
                                {natar.wasOpened ? (
                                    <AddCircleRoundedIcon sx={iconStyle}/>
                                ) : (
                                    <AddIcon sx={iconStyle}/>
                                )}
                            </IconButton>
                        }
                    >
                        <ListItemText
                            primary={`${natar.name}`}
                            sx={{ textAlign: 'right' }}
                        />
                    </ListItem>
                );
            })}
        </List>
    );
};

export default NatarNestedList;