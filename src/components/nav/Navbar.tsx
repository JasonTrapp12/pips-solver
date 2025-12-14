import { AppBar, Toolbar, Box, Button, useTheme } from "@mui/material";
import logo from "../../../src/assets/logo.png";
import { useModalStore } from "../../stores/ModalStore";

interface INavItem {
  label: string;
  onClick?: () => void;
}

const Navbar = () => {
  const theme = useTheme();
  const { setAboutModalOpen } = useModalStore();

  const onAboutClick = () => {
    setAboutModalOpen(true);
  };

  const navItems: INavItem[] = [{ label: "About", onClick: onAboutClick }];
  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" justifyContent="space-between" width="100%" mx={3}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              height: 80,
              cursor: "pointer",
            }}
          />
          <Box display="flex">
            {navItems.map((item) => (
              <Button
                variant="text"
                sx={{ color: theme.palette.text.primary }}
                size="large"
                onClick={item.onClick}
                key={item.label}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
