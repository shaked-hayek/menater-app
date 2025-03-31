
export const rtlStyle = {
    '& label': {
        left: 'unset',
        right: '1.75rem',
        transformOrigin: 'right',
    },
    '& legend': {
        textAlign: 'right',
    },
    // For select fields
    '& .MuiSelect-icon': {
        right: 'auto',
        left: 1,
    },
    '& .MuiSelect-select': {
        paddingLeft: 4, // Add padding to prevent text overlapping with the icon
        paddingRight: '14px !important', // Reduce right padding
    },
};

export const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    p: '1rem',
    gap: '1rem',
};