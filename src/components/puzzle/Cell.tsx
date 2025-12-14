import { Box, Typography, useTheme } from "@mui/material";
import type { ICell } from "../../models/Cell";
import { useBoardStore } from "../../stores/BoardStore";

export interface ICellProps {
  cell: ICell;
  row: number;
  col: number;
}

const Cell = (props: ICellProps) => {
  const { cell, row, col } = props;
  const theme = useTheme();
  const {
    toggleCell,
    phase,
    groups,
    currentGroup,
    startGroup,
    addCellToGroup,
    finishGroup,
    isDragging,
  } = useBoardStore();

  const handleCellClick = () => {
    switch (phase) {
      case "Selecting Cells":
        toggleCell(row, col);
        break;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (phase !== "Selecting Cell Groups") return;

    e.currentTarget.setPointerCapture(e.pointerId);
    startGroup(cell);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || phase !== "Selecting Cell Groups") return;

    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;

    const cellEl = el.closest("[data-cell]");
    if (!cellEl) return;

    const row = Number(cellEl.getAttribute("data-row"));
    const col = Number(cellEl.getAttribute("data-col"));

    const hoveredCell = useBoardStore.getState().cells[row]?.[col];

    if (hoveredCell) {
      addCellToGroup(hoveredCell);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    finishGroup();
  };

  const owningGroup = groups.find((g) => g.cells.includes(cell));
  const isInCurrent = currentGroup.cells.includes(cell);

  return (
    <Box
      data-cell
      data-row={row}
      data-col={col}
      onClick={handleCellClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        bgcolor: theme.palette.primary.main,
        cursor: "pointer",
        userSelect: "none",
        touchAction: "none",
        opacity:
          phase === "Selecting Cells" ? (cell.on ? 1 : 0.4) : cell.on ? 1 : 0.2,
        borderTop: `2px solid ${theme.palette.secondary.main}`,
        borderLeft: `2px solid ${theme.palette.secondary.main}`,
        borderRight: "none",
        borderBottom: "none",

        "&:hover": {
          bgcolor: theme.palette.secondary.light,
        },
      }}
    >
      {cell.on && (
        <Box
          sx={{
            position: "absolute",
            inset: 1,
            bgcolor: isInCurrent
              ? currentGroup.outlineColor
              : owningGroup
              ? owningGroup!.outlineColor
              : null,
            opacity: 0.3,
            pointerEvents: "none",
          }}
        >
          <Typography variant="h2">{cell.value ? cell.value : ""}</Typography>
        </Box>
      )}
    </Box>
  );
};
export default Cell;
