"use client";

import theme from "@/app/components/ThemeRegistry/theme";
import { useEffect, useState } from "react";
import { NostrEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import {
  Event,
  getEmptyEvent,
  getEmptyNostrEvent,
  loadBadgeEvent,
  toNostrEvent,
} from "@/data/eventLib";
import { Group, getEmptyGroup } from "@/data/groupLib";
import { useAccountContext } from "@/context/AccountContext";
import { useNostrContext } from "@/context/NostrContext";
import { useGroupContext } from "@/context/GroupContext";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EditCardFrame } from "@/app/components/EditCardFrame";
import { SaveButtonEx } from "@/app/components/items/SaveButtonEx";
import { BadgeStatus } from "@/app/components/BadgeStatus";
import { ViewRawEvent } from "@/app/components/ViewRawEvent";

export default function PublishGroup({ params }: { params: { id: string } }) {
  const { id } = params;
  const groupContext = useGroupContext();
  const accountContext = useAccountContext();
  const nostrContext = useNostrContext();

  const [relays, setRelays] = useState<string[]>([]);
  const [filter, setFilter] = useState<NDKFilter | undefined>(undefined);
  const [group, setGroup] = useState<Group>(getEmptyGroup());
  const [event, setEvent] = useState<Event>(getEmptyEvent());
  const [nostrEvent, setNostrEvent] = useState<NostrEvent>(
    getEmptyNostrEvent()
  );

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (accountContext.state.account) {
      const relays = accountContext.getRelays();
      setRelays(relays);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountContext.state.account]);

  const load = async () => {
    const group = await groupContext.loadGroup(id);
    if (group) {
      setGroup(group);

      const event = await loadBadgeEvent(group.event);
      if (event) {
        setEvent(event);

        const nostrEvent = toNostrEvent(event);
        setNostrEvent(nostrEvent);

        const filter: NDKFilter = {
          authors: [event.pubkey],
          kinds: [30009],
          "#d": [id],
        };

        setFilter(filter);
      }
    }
  };

  const onSaveClick = async () => {
    const relays = accountContext.getRelays();
    nostrContext.publish(nostrEvent, relays);
    return { success: true, mesg: "Group's badge sent to relays" };
  };

  return (
    <EditCardFrame
      instructions="Re-publish group badge to your configured relays.."
      docLink="help-pages/badge-publish"
    >
      <Stack direction="column" pl={2} pr={2} maxWidth={600} spacing={2}>
        <Box>
          <h3>Group {group.name}</h3>
        </Box>

        <Typography textAlign="left" fontWeight={600} variant="body1">
          Current Relay Status
        </Typography>
        <Box width="100%" bgcolor={theme.palette.background.default}>
          <BadgeStatus
            relays={relays}
            filter={filter}
            badgeEvent={nostrEvent}
          />
        </Box>

        <SaveButtonEx onClick={onSaveClick} buttonLabel="Publish" />
        <ViewRawEvent event={event} />
      </Stack>
    </EditCardFrame>
  );
}
