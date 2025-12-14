import {
  Box,
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useBoardStore } from "../../stores/BoardStore";

type DominoInput = { first: number; second: number };

const CreateDominos = () => {
  const theme = useTheme();
  const { addDomino, phase, nextRequested, completePhase } = useBoardStore();
  const [dominos, setDominos] = useState<DominoInput[]>([
    { first: 0, second: 0 },
  ]);

  const handleChange = (
    index: number,
    field: "first" | "second",
    value: string
  ) => {
    const newDominos = [...dominos];
    newDominos[index][field] = parseInt(value, 10);
    setDominos(newDominos);
  };

  const addNewDomino = () => setDominos([...dominos, { first: 0, second: 0 }]);
  const removeDomino = (index: number) =>
    setDominos(dominos.filter((_, i) => i !== index));

  useEffect(() => {
    if (phase !== "Creating Dominos") return;
    if (!nextRequested) return;

    dominos.forEach((d) => addDomino(d.first, d.second));
    completePhase();
  }, [nextRequested]);

  if (phase !== "Creating Dominos") {
    return <></>;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 2 }}>
      <Box
        sx={{
          maxHeight: 250,
          overflowY: "auto",

          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,0,0,0.4) transparent",

          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 4,
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
        }}
      >
        {dominos.map((d, index) => (
          <Grid
            container
            spacing={1}
            alignItems="center"
            key={index}
            sx={{ mb: 1 }}
          >
            <Grid size={5}>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="First #"
                value={d.first}
                onChange={(e) => handleChange(index, "first", e.target.value)}
                size="small"
                required
              />
            </Grid>
            <Grid size={5}>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Second #"
                value={d.second}
                onChange={(e) => handleChange(index, "second", e.target.value)}
                size="small"
                required
              />
            </Grid>
            <Grid size={2}>
              <IconButton onClick={() => removeDomino(index)}>
                <Remove />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "center" }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.palette.info.main,
            mt: 1,
            border: `2px solid ${theme.palette.divider}`,
            boxShadow: "2",

            "&:hover": {
              bgcolor: theme.palette.info.light,
              borderColor: theme.palette.divider,
              transform: "translateY(-1px)",
            },
          }}
          startIcon={<Add />}
          onClick={addNewDomino}
        >
          Add Domino
        </Button>
      </Box>
    </Box>
  );
};

export default CreateDominos;
