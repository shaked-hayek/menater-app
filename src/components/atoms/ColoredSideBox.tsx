import { Box, BoxProps, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { scrollColor, scrollBackgroundColor, secondaryBackgroundColor } from 'style/colors';
import { useTranslation } from 'react-i18next';

interface CustomBoxProps extends BoxProps {
    title?: string;
    children?: React.ReactNode;
    bgColor?: string;
    height?: string;
    disableOverflowX?: boolean;
    withSearch?: boolean;
    searchQuery?: string;
    setSearchQuery?: (value: string) => void;
}

const ColoredSideBox = ({
    title,
    children,
    bgColor = secondaryBackgroundColor,
    height,
    disableOverflowX = false,
    withSearch = false,
    searchQuery = '',
    setSearchQuery,
    ...props
}: CustomBoxProps) => {
    const { t } = useTranslation();

    return (
        <Box
            {...props}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                textAlign: 'start',
                bgcolor: bgColor,
                height: height ?? 'calc(100vh - 125px)',
                borderRadius: height ? '2%' : '10%',
                p: 2,
                ...props.sx,
            }}
        >
            {title && <Typography variant='h6' sx={{ m: 1 }}>{title}</Typography>}

            {withSearch && (
                <TextField
                    value={searchQuery}
                    onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                    placeholder={t('buttons.search')}
                    size='small'
                    fullWidth
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon sx={{ color: 'gray' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            )}

            <Box
                sx={{
                    overflowY: 'auto',
                    overflowX: disableOverflowX ? 'hidden' : 'auto',
                    width: '100%',
                    flexGrow: 1,
                    '&::-webkit-scrollbar-track': {
                        background: scrollBackgroundColor,
                        borderRadius: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: scrollColor,
                        borderColor: scrollBackgroundColor,
                    },
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default ColoredSideBox;
