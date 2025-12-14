import { useBoardStore } from "../../stores/BoardStore";
import { Box, Stack, Typography } from "@mui/material";
import CreateRules from "./CreateRules";
import CreateDominos from "./CreateDominos";

const PhaseDisplay = () => {
  const { phase } = useBoardStore();

  const getMessageMapping = () => {
    switch (phase) {
      case "Selecting Cells":
        return "Choose which cells to include:";
      case "Selecting Cell Groups":
        return "Drag to select cell groups:";
      case "Creating Rules":
        return "Apply group rules:";
      case "Creating Dominos":
        return "Make dominos:";
      case "Solving":
        return "Solving...";
      case "Solved":
        return "Solved.";
      case "Failed":
        return "Failed to solve.";
    }
  };

  return (
    <Stack width="100%">
      <Box display="flex" gap={2} alignItems="center" ml={2}>
        <Typography variant="h5" fontWeight="600">
          {getMessageMapping()}
        </Typography>
      </Box>
      <Box>
        <CreateRules />
        <CreateDominos />
      </Box>
    </Stack>
  );
};

export default PhaseDisplay;
