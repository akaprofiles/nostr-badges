import theme from "@/app/components/ThemeRegistry/theme";

import React from "react";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useAccountContext } from "@/context/AccountContext";
import {
  useNostrContext,
  PublishedItem,
  PublishCallback,
} from "@/context/NostrContext";
import { PrimaryButton } from "@/app/components/items/PrimaryButton";
import { CopiableText } from "../components/items/CopiableText";

import getChannel from "@/google-api/getChannel";
import { loadAkaBadge } from "@/data/akaBadgeLib";
import { Platforms } from "@/data/socialMediaFields";
import { loadBadge } from "@/data/badgeLib";
import { getDefaultRelays } from "@/data/relays";
import {
  createBadgeAward,
  createBadgeAwardEvent,
  getRelays,
} from "@/data/serverActions";
import { NostrEvent } from "@nostr-dev-kit/ndk";

const helperText = "e.g. https://www.youtube.com/@handle";

function extractHandle(url: string): string | null {
  const regex = /https:\/\/www\.youtube\.\w{2,3}(\.\w{2})?\/(@[^\/]+)/;
  const match = url.match(regex);
  return match ? match[2] : null;
}

interface AddYouTubeProps {
  npub: string;
  open: boolean;
  onClose: () => void;
}

const AddYouTube: React.FC<AddYouTubeProps> = ({ npub, open, onClose }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [channelUrl, setChannelUrl] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState(helperText);
  const [status, setStatus] = useState("");

  // alert
  const [showAlert, setShowAlert] = useState(false);
  const [isSaveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [alertMesg, setAlertMesg] = useState<string>("");

  const showError = (error: string) => {
    setAlertMesg(error);
    setSaveSuccess(false);
    setShowAlert(true);
  };

  const accountContext = useAccountContext();
  const nostrContext = useNostrContext();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setChannelUrl(value);
  };

  const onBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    if (channelUrl == "") {
      setError(helperText);
      setHandle("");
      return;
    }

    const handle = extractHandle(channelUrl);
    if (!handle) {
      setError("Handle not found in URL");
      setHandle("");
    } else {
      setHandle(handle);
      setError(helperText);
    }
  };

  const publishCallback: PublishCallback = (publishedItem: PublishedItem) => {
    setStatus("published");
    setIsVerifying(false);
    onClose();
  };

  const doVerify = async () => {
    if (handle == "") {
      return;
    }

    setStatus("verifying...");
    setIsVerifying(true);
    const result = await getChannel(handle);
    if (!result.success) {
      showError(result.error);
      setIsVerifying(false);
      return;
    }

    const fields = result.fields;

    if (!fields.description.includes(npub)) {
      showError("npub text not found in description");
      setIsVerifying(false);
      return;
    }

    setStatus("creating badge...");
    const youTubeBadge = await loadAkaBadge(Platforms.YouTube);
    if (youTubeBadge == undefined) {
      showError("YouTube Channel Owner badge not found.");
      setIsVerifying(false);
      return;
    }

    const badge = await loadBadge(youTubeBadge.id);
    if (badge == undefined) {
      showError("YouTube Channel Owner badge not found.");
      setIsVerifying(false);
      return;
    }

    let channelUrl = fields.url;
    if (channelUrl.startsWith("@")) {
      fields.url = "https://www.youtube.com/" + fields.url;
    }

    // createBadgeAward
    const id = `${youTubeBadge.id}-${handle}`;
    const createResult = await createBadgeAward(
      id,
      youTubeBadge.id,
      accountContext.currentProfile.uid,
      accountContext.currentProfile.publickey,
      fields
    );

    // publish events
    setStatus("publishing event...");
    const event = await createBadgeAwardEvent(id);

    // publish to badge owner's relays
    let getRelaysResult = await getRelays(badge.uid);
    let relays = getRelaysResult.relays;
    if (getRelaysResult.defaultRelays) {
      relays = relays.concat(getDefaultRelays());
    }
    nostrContext.publishWithCallback(
      event as NostrEvent,
      relays,
      publishCallback
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "400px",
          height: "500px",
          rowGap: 2,
          pt: 3,
          pl: 4,
          pr: 4,
          pb: 4,
        }}
      >
        <Typography variant="body1" fontWeight={600}>
          Add your YouTube Channel
        </Typography>
        <Box>
          <Typography variant="body1" paddingBottom={1}>
            1. Enter your Channel URL
          </Typography>
          <TextField
            size="small"
            label="Channel URL"
            helperText={error}
            disabled={isVerifying}
            value={channelUrl}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            error={error !== helperText}
            fullWidth
          ></TextField>
        </Box>
        <Box maxWidth="300px">
          <Typography variant="body1" paddingBottom={1}>
            2. Add this text to the channel&apos;s description
          </Typography>
          <CopiableText initValue={npub} variant="subtitle1"></CopiableText>
        </Box>

        <Box paddingBottom={1}>
          <Typography variant="body1">
            3. Click Verify below once ready
          </Typography>
        </Box>
        <Box>
          <Collapse in={showAlert} sx={{ pt: 1, pb: 1 }}>
            <Alert
              severity={isSaveSuccess ? "success" : "error"}
              onClose={() => {
                setShowAlert(false);
              }}
              sx={{ minWidth: "100px", width: "fit-content" }}
            >
              {alertMesg}
            </Alert>
          </Collapse>
          <Box
            sx={{
              display: "flex",
              widows: "100%",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {isVerifying && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
                <Typography variant="subtitle1" fontStyle="italic">
                  {status}
                </Typography>
              </Box>
            )}

            <PrimaryButton
              buttonLabel="Verify"
              disabledLabel={isVerifying ? "verifying..." : ""}
              onClick={doVerify}
            ></PrimaryButton>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Button onClick={onClose}>
            <Typography
              variant="subtitle2"
              align="center"
              fontWeight="600"
              sx={{
                "&:hover": { color: { color: theme.palette.blue.dark } },
              }}
            >
              CLOSE
            </Typography>
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddYouTube;
