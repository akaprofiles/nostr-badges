import React from "react";
import { Box, Typography } from "@mui/material";

interface DotSeparatedTextProps {
  items: string[];
}

export const DotSeparatedText: React.FC<DotSeparatedTextProps> = ({
  items,
}) => {
  return (
    <Box display="flex" alignItems="center">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Typography variant="subtitle2">{item}</Typography>
          {index < items.length - 1 && (
            <Typography variant="subtitle1" sx={{ mx: 0.8 }}>
              &middot;
            </Typography>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};
