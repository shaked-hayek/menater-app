import { Button, ButtonProps } from '@mui/material';
import { darkTextColor, lightBgColor, lightTextColor, mainButtonColor, seconderyButtonColor } from 'style/colors';

// Extend ButtonProps to support all MUI button attributes
interface CustomButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

export const MainButton = ({ children, ...props }: CustomButtonProps) => {
  return (
    <Button
      {...props}
      sx={{
        bgcolor: mainButtonColor,
        color: lightTextColor,
      }}
    >
      {children}
    </Button>
  );
};

export const SeconderyButton = ({ children, ...props }: CustomButtonProps) => {
  return (
    <Button
      {...props}
      sx={{
        bgcolor: seconderyButtonColor,
        color: darkTextColor,
      }}
    >
      {children}
    </Button>
  );
};


export const TrialButton = ({ children, ...props }: CustomButtonProps) => {
    return (
      <Button
        {...props}
        sx={{
          bgcolor: lightBgColor,
          color: lightTextColor,
        }}
      >
        {children}
      </Button>
    );
  };
