import { DataField } from "@/data/badgeLib";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import Typography from "@mui/material/Typography";

export const BadgeAwardData = (props: {
  data: object;
  fields: DataField[];
}) => {
  const { data, fields } = props;
  const displayData: { label: string; value: string; description: string }[] =
    [];

  Object.entries(data).map(([key, value]) => {
    let label = key;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.name == key) {
        displayData.push({
          label: field.label ?? label,
          value: value,
          description: field.description ?? "",
        });
      }
    }
  });

  return (
    <Box sx={{ pl: "10px", pr: "4px", pt: "4px", pb: "4px" }}>
      <Table size="small">
        <TableBody sx={{ border: "none" }}>
          {displayData.map((item, index) => (
            <TableRow key={index}>
              <TableCell
                sx={{
                  width: "25%",
                  border: "none",
                  padding: "0px",
                  verticalAlign: "top",
                }}
              >
                <Typography variant="body2" whiteSpace="pre-wrap">
                  {item.label}:
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "0px", pl: "8px" }}>
                <Typography variant="body2" whiteSpace="pre-wrap">
                  {item.value}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
