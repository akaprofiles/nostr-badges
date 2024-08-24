import React from "react";
import { Box, Typography } from "@mui/material";

interface DotSeparatedTextProps {
  items: string[];
}

export const abbreviateNum = (num: number): string => {
  if (num >= 1_000_000_000) {
    const billions = num / 1_000_000_000;
    return billions >= 100
      ? Math.floor(billions) + "B"
      : billions.toFixed(1).replace(/\.0$/, "") + "B";
  } else if (num >= 1_000_000) {
    const millions = num / 1_000_000;
    return millions >= 100
      ? Math.floor(millions) + "M"
      : millions.toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    const thousands = num / 1_000;
    return thousands >= 100
      ? Math.floor(thousands) + "K"
      : thousands.toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return num.toString();
  }
};

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
