import { Button, Box, useTheme } from "@mui/material";
import { useBoardStore } from "../../stores/BoardStore";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import UndoIcon from "@mui/icons-material/Undo";

const Actions = () => {
  const { requestNext, requestUndo } = useBoardStore();
  const theme = useTheme();

  return (
    <Box display="flex" width="100%" gap={2} justifyContent="space-between">
      <Button
        variant="outlined"
        sx={{
          mt: 1,
          border: `2px solid ${theme.palette.divider}`,
          color: theme.palette.divider,

          "&:hover": {
            bgcolor: theme.palette.divider,
            borderColor: theme.palette.divider,
            transform: "translateY(-1px)",
            color: theme.palette.text.primary,
            border: `2px solid ${theme.palette.text.primary}`,
          },
        }}
        endIcon={<UndoIcon />}
        onClick={requestUndo}
      >
        Undo
      </Button>
      <Button
        variant="contained"
        sx={{
          bgcolor: theme.palette.success.main,
          mt: 1,
          border: `2px solid ${theme.palette.divider}`,
          boxShadow: "2",

          "&:hover": {
            bgcolor: theme.palette.success.light,
            borderColor: theme.palette.divider,
            transform: "translateY(-1px)",
          },
        }}
        endIcon={<ArrowForwardIosIcon />}
        onClick={requestNext}
      >
        Next
      </Button>
    </Box>
  );
};
export default Actions;
