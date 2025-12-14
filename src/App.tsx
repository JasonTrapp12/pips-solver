import { alpha, Box, Paper, Stack, useTheme } from "@mui/material";
import "./App.css";
import Board from "./components/puzzle/Board";
import PhaseDisplay from "./components/puzzle/Phase";
import "./testUtil";
import Actions from "./components/actions/Actions";
import Navbar from "./components/nav/Navbar";
import AboutModal from "./components/modals/AboutModal";

function App() {
  const theme = useTheme();
  return (
    <Box width="100vw" height="100vh">
      <Stack width="100%" height="100%">
        <Navbar />
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: alpha(theme.palette.background.paper, 0.55),
              borderRadius: 2,

              boxShadow: `
              inset 0 1px 8px rgba(0,0,0,0.25),
              inset 0 -2px 8px rgba(255,255,255,0.15)
            `,
              border: `1px solid ${alpha(theme.palette.common.white, 0.15)}`,
            }}
          >
            <Stack
              width="650px"
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <PhaseDisplay />
              <Actions />
              <Board />
              <AboutModal />
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}

export default App;
