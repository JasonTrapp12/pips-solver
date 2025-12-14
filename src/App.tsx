import { Box, Stack } from "@mui/material";
import "./App.css";
import Board from "./components/puzzle/Board";
import PhaseDisplay from "./components/puzzle/Phase";
import "./testUtil";
import Actions from "./components/actions/Actions";
import Navbar from "./components/nav/Navbar";
import AboutModal from "./components/modals/AboutModal";

function App() {
  return (
    <Stack
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Navbar />
      <Stack
        width="650px"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <PhaseDisplay />
        <Actions />
        <Board />
        <AboutModal />
      </Stack>
    </Stack>
  );
}

export default App;
