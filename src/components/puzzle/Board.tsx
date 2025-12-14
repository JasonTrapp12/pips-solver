import { Box, Grid, Paper, useTheme } from "@mui/material";
import Cell from "./Cell";
import { useBoardStore } from "../../stores/BoardStore";
import { useEffect, useRef } from "react";

const Board = () => {
  const theme = useTheme();
  const {
    cells,
    phase,
    finishGroup,
    nextRequested,
    completePhase,
    groups,
    dominos,
  } = useBoardStore();
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      if (phase === "Selecting Cell Groups") finishGroup();
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [finishGroup]);

  useEffect(() => {
    if (
      nextRequested &&
      (phase === "Selecting Cells" || phase === "Selecting Cell Groups")
    ) {
      completePhase();
    }
  }, [nextRequested]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../workers/solver.worker.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (e) => {
      if (e.data.type === "done") {
        const { solved, gameState } = e.data;

        if (solved) {
          useBoardStore.setState({
            cells: gameState.cells,
            groups: gameState.groups,
            dominos: gameState.dominos,
          });
          completePhase();
        } else {
          completePhase(false);
        }
      }
    };

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (phase !== "Solving") return;
    if (!workerRef.current) return;
    workerRef.current.postMessage({
      cells,
      groups,
      dominos,
    });
  }, [phase]);

  return (
    <Box
      sx={{
        width: "650px",
        height: "650px",
        borderRadius: 1,
        border: `2px solid ${theme.palette.secondary.main}`,
        overflow: "hidden",
        boxShadow: "3",
      }}
    >
      <Grid container sx={{ width: "100%", height: "100%" }}>
        {cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Grid key={`${rowIndex}-${colIndex}`} size={1}>
              <Cell cell={cell} row={rowIndex} col={colIndex} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Board;
