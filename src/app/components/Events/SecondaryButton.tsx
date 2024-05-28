"use client";

import theme from "../ThemeRegistry/theme";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export const SecondaryButton = (props: {
  buttonLabel: string;
  url: string;
}) => {
  const { buttonLabel, url } = props;

  return (
    <Button
      variant="contained"
      color="primary"
      href={url}
      sx={{
        width: "80%",
        color: theme.palette.grey[200],
        backgroundColor: theme.palette.grey[600],
        "&:hover": {
          color: theme.palette.grey[200],
          backgroundColor: theme.palette.grey[800],
        },
      }}
    >
      <Typography variant="body2" align="center" fontWeight="800">
        {buttonLabel}
      </Typography>
    </Button>
  );
};
