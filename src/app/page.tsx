/* eslint-disable @next/next/no-img-element */
"use client";

import theme from "@/app/components/ThemeRegistry/theme";
import Box from "@mui/material/Box";
import { AkaAppBar } from "./components/AkaAppBar";
import { Login } from "./components/Login";
import Grid from "@mui/material/Grid";
import ThemeRegistry from "./components/ThemeRegistry/ThemeRegistry";
import { CapIcon } from "./components/items/CapIcon";

export default function Home() {
  return (
    <ThemeRegistry>
      <Box position="fixed" top={0} width="100%" height="48px">
        <AkaAppBar />
      </Box>

      <Grid
        container
        sx={{ height: "100vh", width: "100%" }}
        rowSpacing={0}
        marginTop="48px"
        position="fixed"
      >
        {/* Image on the left */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: theme.palette.blue.light,
              width: "100%",
              pb: "30px",
            }}
          >
            <CapIcon
              fontSize="large"
              sx={{
                color: theme.palette.orange.main,
                width: "280px",
                height: "280px",
              }}
            />
          </Box>
        </Grid>

        {/* Login box on the right for screens greater than md breakpoint */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: theme.palette.background.paper,
              width: "100%",
              pb: "30px",
            }}
          >
            <Login />
          </Box>
        </Grid>

        {/* Login box centered for screens less than md breakpoint */}
        <Grid item xs={12} sx={{ display: { md: "none" }, flexGrow: 1 }}>
          <Box
            sx={{
              padding: theme.spacing(3),
              textAlign: "center",
              height: "100%",
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Login />
          </Box>
        </Grid>
      </Grid>
    </ThemeRegistry>
  );
}
