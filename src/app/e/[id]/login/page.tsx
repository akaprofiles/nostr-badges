import Box from "@mui/material/Box";

import { Event, toNostrEvent } from "@/data/eventLib";
import { getEvent } from "@/data/serverActions";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import * as nip19 from "@/nostr-tools/nip19";
import { Login } from "@/app/components/Login/Login";
import { ViewBadgeEventSmall } from "@/app/components/Events/ViewBadgeEventSmall";

export default async function LoginPage({
  params,
}: {
  params: { id: string };
}) {
  const decoded = nip19.decode(params.id);
  let addressPointer: nip19.AddressPointer | undefined = undefined;
  if (decoded.type == "naddr") {
    addressPointer = decoded.data as nip19.AddressPointer;
  }
  let event: Event | undefined = undefined;
  let nostrEvent: NostrEvent | undefined = undefined;
  let id: string = "";
  let data = await getEvent(params.id);
  if (data != null) {
    event = data.event as Event;
    nostrEvent = toNostrEvent(event);
    id = data.id;
  }

  return (
    <Box minHeight={320} maxWidth={360}>
      <Login
        title="Badge earned!"
        instructions="To save your badge, please sign in."
      >
        <ViewBadgeEventSmall id={id} e={nostrEvent!} />
      </Login>
    </Box>
  );
}
