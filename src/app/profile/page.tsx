"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as nip19 from "@/nostr-tools/nip19";
import theme from "@/app/components/ThemeRegistry/theme";
import { useRouter } from "next/navigation";
import { useAccountContext } from "@/context/AccountContext";
import { BadgeAward } from "@/data/badgeAwardLib";
import { loadAkaBadgeAwards } from "@/data/akaBadgeLib";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { CommonLayout } from "../components/ComonLayout";
import { Section } from "./edit/Section";
import { Add } from "./Add";
import { ProfileDisplay } from "./ProfileDisplay";
import { BadgesDisplay } from "./BadgesDisplay";
import { Platforms } from "@/data/socialMediaFields";
import { SocialsButton } from "./SocialsButton";
import { Badge } from "@/data/badgeLib";
import { BadgeAwardItem } from "./BadgeAwardItem";

const AddYouTube = dynamic(() => import("./AddYouTube"));

export default function ProfilePage() {
  const accountContext = useAccountContext();
  const loading = accountContext.state.loading;

  const router = useRouter();
  const profile = accountContext.currentProfile;
  const npub = nip19.npubEncode(profile.publickey);

  const [showSocials, setShowSocials] = useState(false);
  const [openYouTube, setOpenYouTube] = useState(false);
  const [socials, setSocials] = useState(
    [] as { badge: Badge; badgeAward: BadgeAward }[]
  );

  const handleEdit = (id: string) => {
    router.push("/profile/edit");
  };

  const onYouTubeClick = () => {
    setOpenYouTube(true);
  };

  const onYouTubeClose = () => {
    setOpenYouTube(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const badgesWithAwards = await loadAkaBadgeAwards("social", profile.uid);
      setSocials(badgesWithAwards);
    };

    if (profile.uid != "") {
      fetchData();
    }
  }, [profile.uid]);

  return (
    <CommonLayout
      developerMode={false}
      bgColor={theme.palette.background.default}
    >
      {loading && (
        <Stack maxWidth="800px" minWidth="300px" pt={4} spacing={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        </Stack>
      )}
      {!loading && (
        <>
          <Box sx={{ width: "100%", bgcolor: "white" }}>
            <Section id="profile" border={false} onEdit={handleEdit}>
              <ProfileDisplay profile={profile} extra={true} />
            </Section>
          </Box>
          <Stack
            width="100%"
            maxWidth="800px"
            minWidth="300px"
            pt={1}
            spacing={2}
          >
            <Box padding={1}>
              <Typography variant="h6" paddingBottom={1}>
                Social Media Accounts
              </Typography>
              <Stack direction="column" flexWrap="wrap" rowGap={2}>
                {socials.map((data, index) => (
                  <Card key={index}>
                    <BadgeAwardItem
                      key={index}
                      id={index.toString()}
                      badge={data.badge}
                      badgeAward={data.badgeAward}
                    />
                  </Card>
                ))}
              </Stack>

              <Add
                label="add account"
                onClick={() => {
                  setShowSocials(!showSocials);
                }}
              />
              {showSocials && (
                <Box
                  id="socialButtons"
                  sx={{ width: "auto", display: "inline-flex" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      columnGap: 3,
                      padding: 1,
                    }}
                  >
                    <SocialsButton
                      type={Platforms.YouTube}
                      onClick={onYouTubeClick}
                    />
                    <SocialsButton type={Platforms.Twitter} />
                    <SocialsButton type={Platforms.Facebook} />
                    <SocialsButton type={Platforms.Instagram} />
                  </Box>
                </Box>
              )}
              <AddYouTube
                npub={npub}
                open={openYouTube}
                onClose={onYouTubeClose}
              />
            </Box>

            <Box p={1}>
              <Typography variant="h6" paddingBottom={1}>
                Badges
              </Typography>

              <BadgesDisplay uid={profile.uid} pubkey={profile.publickey} />
            </Box>
          </Stack>
        </>
      )}
    </CommonLayout>
  );
}
