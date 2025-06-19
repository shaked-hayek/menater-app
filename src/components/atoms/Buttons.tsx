import { Button, ButtonProps } from '@mui/material';
import { darkTextColor, lightBgColor, lightTextColor, mainButtonColor, secondaryButtonColor, themeColor, trialBgColor } from 'style/colors';

// Extend ButtonProps to support all MUI button attributes
interface CustomButtonProps extends ButtonProps {
  children?: React.ReactNode;
  height?: string | number;
}

export const MainButton = ({ children, height = '80px', ...props }: CustomButtonProps) => {
  return (
    <Button
      {...props}
      sx={{
        bgcolor: mainButtonColor,
        color: lightTextColor,
        flex: 1, 
        minHeight: height,
        maxWidth: '200px', 
        fontSize: '1.2rem', 
      }}
    >
      {children}
    </Button>
  );
};

export const SecondaryButton = ({ children, ...props }: CustomButtonProps) => {
  return (
    <Button
      {...props}
      sx={{
        bgcolor: secondaryButtonColor,
        color: darkTextColor,
      }}
    >
      {children}
    </Button>
  );
};


export const CreateDataButton = ({ children, ...props }: CustomButtonProps) => {
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

  export const EmergencyButton = ({ children, ...props }: CustomButtonProps) => {
    return (
      <Button
        {...props}
        sx={{
          bgcolor: themeColor,
          color: lightTextColor,
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
          bgcolor: trialBgColor,
          color: lightTextColor,
        }}
      >
        {children}
      </Button>
    );
  };