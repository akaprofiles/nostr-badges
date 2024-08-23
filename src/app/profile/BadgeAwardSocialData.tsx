import { useState, useEffect } from "react";
import getChannel from "@/google-api/getChannel";
import { Platforms, getEmptySocialMediaFields } from "@/data/socialMediaFields";

import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { DotSeparatedText } from "./DotSeperatedText";

export const BadgeAwardSocialData = (props: { data: object }) => {
  const width = "48px";
  const height = "48px";

  const { data } = props;
  const [avatarUrl, setAvatarUrl] = useState("/default/profile.png");
  const [metaItems, setMetaItems] = useState([] as string[]);

  let socialFields = getEmptySocialMediaFields();
  socialFields = { ...socialFields, ...data };

  useEffect(() => {
    const updateYouTube = async () => {
      const handle = socialFields.identity;
      const channel = await getChannel(handle);

      if (channel.fields.avatar.url) {
        setAvatarUrl(channel.fields.avatar.url);
      }

      const metaItems: string[] = [];
      metaItems.push(socialFields.identity);
      if (socialFields.followers > 0)
        metaItems.push(`${socialFields.followers} subscribers`);
      if (socialFields.views > 0) metaItems.push(`${socialFields.views} views`);
      if (socialFields.items > 0)
        metaItems.push(`${socialFields.items} videos`);
      setMetaItems(metaItems);
    };

    switch (socialFields.platform) {
      case Platforms.YouTube:
        updateYouTube();
        break;
      default:
        setAvatarUrl(socialFields.avatar.url);

        metaItems.push(socialFields.identity);
        if (socialFields.followers > 0)
          metaItems.push(`${socialFields.followers} followers`);
        if (socialFields.views > 0)
          metaItems.push(`${socialFields.views} views`);
        if (socialFields.items > 0)
          metaItems.push(`${socialFields.items} items`);
        setMetaItems(metaItems);
    }
  }, [socialFields.platform]);

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: width,
          height: height,
          borderRadius: "50%", // Makes the Box circular
          overflow: "hidden", // Ensures the image doesn't overflow the circle
          display: "flex", // Centers the image
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {socialFields.avatar.url != "" && (
          <CardMedia
            component="img"
            sx={{ width: height, height: height, objectFit: "cover" }}
            image={avatarUrl}
            alt="avatar image"
          />
        )}
      </Box>

      <Box sx={{ width: "100%", ml: 2, maxHeight: height, pb: 1 }}>
        <Stack direction="column" justifyContent="left" alignItems="left">
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "16rem",
            }}
          >
            <Typography
              noWrap
              variant="body1"
              fontWeight={600}
              sx={{ minWidth: 0, pt: 0 }}
            >
              {socialFields.title}
            </Typography>
          </div>

          <DotSeparatedText items={metaItems} />
        </Stack>
      </Box>
    </Box>
  );
};
