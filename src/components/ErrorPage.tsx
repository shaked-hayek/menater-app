import { Typography } from "@mui/material";


const ErrorPage = (errorMsg : string) => {
    return (
    <>
        <Typography variant='h3'>{errorMsg}</Typography>
    </>
    );
};

export default ErrorPage;