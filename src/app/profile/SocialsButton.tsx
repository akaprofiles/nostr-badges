import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Platforms } from "@/data/socialMediaFields";

const SocialsName: { [key in Platforms]: string } = {
  [Platforms.YouTube]: "YouTube",
  [Platforms.Twitter]: "coming soon...",
  [Platforms.Facebook]: "coming soon...",
  [Platforms.Instagram]: "coming soon...",
  [Platforms.LinkedIn]: "coming soon...",
};

interface SocialsButtonProps {
  type: Platforms; // Object containing data
  onClick?: () => void;
}

export const SocialsButton: React.FC<SocialsButtonProps> = ({
  type,
  onClick,
}) => {
  const imageSrc = `/socials/${type}.svg`;
  let hoverOpacity = onClick ? 1 : 0.75;
  let label = "";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: 0.75,
        pointerEvents: onClick ? "auto" : "none",
        transition: "opacity 0.3s",
        "&:hover": {
          opacity: hoverOpacity,
        },
      }}
      onClick={onClick}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={type}
        sx={{
          border: 0,
          width: "80px",
          height: "80px",
        }}
      />
      <Typography variant="subtitle2" fontWeight={600} lineHeight={1.5}>
        {SocialsName[type]}
      </Typography>
    </Box>
  );
};
