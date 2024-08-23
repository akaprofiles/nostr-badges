import Box from "@mui/material/Box";
import { Platforms, SocialMediaFields } from "@/data/socialMediaFields";

export const SocialMediaBadge = (fields: SocialMediaFields) => {
  return <Box>{JSON.stringify(fields)}</Box>;
};
