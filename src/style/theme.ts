import { createTheme } from "@mui/material/styles";
import { fontFamilyString } from "./fonts";

const theme = createTheme({
  typography: {
    fontFamily: fontFamilyString,
  },
});

export default theme;