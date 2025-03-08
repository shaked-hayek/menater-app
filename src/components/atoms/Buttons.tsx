import { Button } from '@mui/material';
import { darkTextColor, lightTextColor, mainButtonColor, seconderyButtonColor } from 'style/colors';

interface buttonProps {
    // buttonText: string,
    children?: string,
}

export const MainButton = ({ children }: buttonProps) => {
    return (
        <Button sx={{
            bgcolor: mainButtonColor,
            fontStyle: { 
                color: lightTextColor, 
            },
        }}>{children}</Button>
    );
};

export const SeconderyButton = ({ children }: buttonProps) => {
    return (
        <Button sx={{
            bgcolor: seconderyButtonColor,
            fontStyle: { 
                color: darkTextColor, 
            },
        }}>{children}</Button>
    );
};
