import * as nip19 from "@/nostr-tools/nip19";
import { Badge, DataField } from "@/data/badgeLib";
import { BadgeAward } from "@/data/badgeAwardLib";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import Typography from "@mui/material/Typography";

import { ItemRowSmall } from "../components/ItemRowSmall";
import { BadgeAwardData } from "./BadgeAwardData";
import { BadgeAwardSocialData } from "./BadgeAwardSocialData";
import { isSocialMediaFields } from "@/data/socialMediaFields";

export const BadgeAwardItem = ({
  id,
  badgeAward,
  badge,
}: {
  id: string;
  badgeAward: BadgeAward;
  badge: Badge;
}) => {
  // @ts-ignore
  const formattedDate = badgeAward.created.toDate().toLocaleDateString();
  const link = `${process.env.NEXT_PUBLIC_AKA_GET}/njump/${badge.event}`;
  const npub = nip19.npubEncode(badge.publickey);
  const issuerLink = `${process.env.NEXT_PUBLIC_NJUMP_HOST}${npub}`;
  const displaySocial = badgeAward.data && isSocialMediaFields(badgeAward.data);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Link href={link} underline="none">
        <ItemRowSmall
          id={id}
          name={badge.name}
          description={badge.description}
          image={badge.image}
          widthOption="full"
          heightOption="short"
        />
      </Link>

      {badgeAward.data && !displaySocial && (
        <BadgeAwardData data={badgeAward.data} fields={badge.dataFields} />
      )}
      {badgeAward.data && displaySocial && (
        <Box sx={{ pl: 4, pt: 1, pb: 1 }}>
          <BadgeAwardSocialData data={badgeAward.data} />
        </Box>
      )}

      <Box pl="10px" pb="4px" maxWidth="600px">
        <Typography variant="body2" sx={{ display: "inline" }}>
          {`awarded ${formattedDate} by `}
        </Typography>
        <Link href={issuerLink} underline="none">
          <Typography
            variant="body2"
            fontWeight="600"
            sx={{ display: "inline" }}
          >
            {badge.issuerName}
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};
