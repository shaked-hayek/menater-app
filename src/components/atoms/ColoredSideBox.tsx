import { Box, BoxProps } from "@mui/material"
import { secondaryBackgroundColor } from "style/colors";

interface CustomBoxProps extends BoxProps {
    children?: React.ReactNode;
    bgColor?: string;
  }

const ColoredSideBox = ({ children, bgColor = secondaryBackgroundColor, ...props }: CustomBoxProps) => {
    return (
        <Box 
            {...props}
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                bgcolor: bgColor, 
                height: '100%', 
                borderRadius: '10%', 
                p: 2 }}
        >
            {children}
        </Box>
    );
};

export default ColoredSideBox;