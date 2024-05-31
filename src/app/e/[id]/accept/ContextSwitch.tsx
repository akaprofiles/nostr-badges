"use client";

import { useState, useEffect } from "react";
import { useSessionContext } from "@/context/SessionContext";
import { useAccountContext } from "@/context/AccountContext";
import { useNostrContext } from "@/context/NostrContext";

import { SessionState } from "@/context/SessionHelper";
import { Profile } from "@/data/profileLib";
import { PubkeySourceType } from "@/data/sessionLib";
import { getDefaultRelays } from "@/data/relays";
import { getRelays } from "@/data/serverActions";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { SignIn } from "../SignIn";

export type StageType =
  | "LOADING"
  | "VERIFYING"
  | "CHANGING_PUBKEY"
  | "ACCEPTING";

export const ContextSwitch = () => {
  const [stage, setStage] = useState<StageType>("LOADING");

  const nostrContext = useNostrContext();
  const sessionContext = useSessionContext();
  const type = sessionContext.state.session?.type ?? "";
  const pubkey = sessionContext.state.session?.pubkey ?? "";
  const pubkeySource: PubkeySourceType =
    sessionContext.state.session?.pubkeySource ?? "DIRECT";
  const sessionState = sessionContext.getSessionState();

  const accountContext = useAccountContext();
  const uid = accountContext.state.account?.uid ?? "";

  const getHeader = (type: string) => {
    switch (type) {
      case "BADGE":
        return "Badge issued!";
      case "GROUP":
        return "Membership approved!";
      default:
        return "Approved!";
    }
  };

  const getInstructions = (type: string, useRecommended: boolean) => {
    if (!useRecommended) {
      switch (type) {
        case "BADGE":
          return "Select an account to assign this badge.";
        case "GROUP":
          return "Select an account to assign this group membership.";
        default:
          return "Select an account";
      }
    } else {
      switch (type) {
        case "BADGE":
          return "Login with this account to accept this badge.";
        case "GROUP":
          return "Login with this account to accept group membership.";
        default:
          return "Login";
      }
    }
  };

  const header = getHeader(type);
  const instructions = getInstructions(type, pubkey != "");

  useEffect(() => {
    const sessionStage = sessionContext.getSessionState();
    console.log(`ContextSwitch ${sessionStage}`);

    if (sessionStage == SessionState.ReadyToAward) {
      setStage("VERIFYING");
      return;
    }

    if (sessionStage == SessionState.PubkeyVerified) {
      setStage("ACCEPTING");
      createAndPublishEvents();
      return;
    }
  }, [sessionContext.state]);

  const onSignIn = (profile: Profile, source: PubkeySourceType) => {
    console.log(`onSignIn: ${JSON.stringify(profile)} ${source}`);
    setStage("CHANGING_PUBKEY");
    const pubkey = profile.publickey;
    sessionContext.changePubkey(pubkey, source);
  };

  const createAndPublishEvents = async () => {
    const session = sessionContext.state.session;
    if (!session || sessionState != SessionState.PubkeyVerified) return;

    await sessionContext.createBadgeAwards(uid, pubkey);
    const events = await sessionContext.getSignedEvents();
    // get relays associated with badge / group owner
    const result = await getRelays(session.itemState.owner);
    let relays = result.relays;

    if (result.defaultRelays) {
      relays = relays.concat(getDefaultRelays());
    }

    for (let i = 0; i < events.length; i++) {
      nostrContext.publish(events[i], relays);
    }
  };

  return (
    <>
      {stage == "LOADING" && <>loading</>}
      {stage == "VERIFYING" && (
        <>
          <Box pt={2} pb={3} width="100%">
            <SignIn
              isVisible={stage == "VERIFYING"}
              pubkey={pubkey}
              source={pubkeySource}
              save={true}
              onSignIn={onSignIn}
            />
          </Box>
        </>
      )}
      {(stage == "ACCEPTING" || stage == "CHANGING_PUBKEY") && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box pt={1}>
            <CircularProgress />
          </Box>
          <Typography variant="body1" textAlign="center">
            saving...
          </Typography>
        </Box>
      )}
    </>
  );
};
