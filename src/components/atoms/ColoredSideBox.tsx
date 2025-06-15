import { Box, BoxProps, Typography } from "@mui/material"
import { scrollColor, scrollBackgroundColor, secondaryBackgroundColor } from "style/colors";

interface CustomBoxProps extends BoxProps {
    title?: string;
    children?: React.ReactNode;
    bgColor?: string;
    height?: string;
  }

const ColoredSideBox = ({ title, children, bgColor = secondaryBackgroundColor, height, ...props }: CustomBoxProps) => {
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
                borderRadius: '10%',
                p: 2,
                ...props.sx,
            }}
        >
            {title && <Typography variant='h6' sx={{m: 1}}>{title}</Typography>}
            <Box sx={{
                overflowY: 'auto',
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
            }}>
                {children}
            </Box>
        </Box>
    );
};

export default ColoredSideBox;