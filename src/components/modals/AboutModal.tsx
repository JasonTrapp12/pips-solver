import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useModalStore } from "../../stores/ModalStore";
import CloseIcon from "@mui/icons-material/Close";

const AboutModal = () => {
  const theme = useTheme();
  const { aboutModalOpen, setAboutModalOpen } = useModalStore();
  return (
    <Dialog
      open={aboutModalOpen}
      onClose={() => setAboutModalOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 600 }}>About</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setAboutModalOpen(false)}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        dividers
        sx={{ background: theme.palette.background.default }}
      >
        <Typography variant="h6" fontWeight={600}>
          Version 1.0
        </Typography>
        <Typography
          variant="body2"
          color={theme.palette.text.secondary}
          gutterBottom
        >
          Last Updated: 12/13/25
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          Github:{" "}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
export default AboutModal;
