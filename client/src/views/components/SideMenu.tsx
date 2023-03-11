/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FlakyIcon from "@mui/icons-material/Flaky";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GavelIcon from "@mui/icons-material/Gavel";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CognitoAuthApi } from "../../auth/auth-api";
import { clearSession, useSession } from "../../auth/AuthContext";

const drawerWidth = 354;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  title?: string;
  children?: React.ReactNode;
}

export default function SideMenu(props: Props) {
  const { window, children, title } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { session } = useSession();

  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearSession();
    location.assign(CognitoAuthApi.logoutUrl());
  };

  const menus = [
    {
      text: "Project List",
      to: "/project/list",
      icon: <FormatListBulletedIcon />,
    },
    {
      text: "Vote T3 Token",
      to: "/project/vote",
      icon: <HowToVoteIcon />,
    },
    {
      text: "Post Result",
      to: "/project/post-result",
      icon: <GavelIcon />,
    },
    {
      text: "Evaluate Project",
      to: "/project/evaluate",
      icon: <FlakyIcon />,
    },
  ];

  const drawer = (
    <div
      css={css`
        width: 100%;
        text-align: center;
      `}
    >
      <Toolbar sx={{ minHeight: { sm: "96px" } }} />
      <Divider />
      <Button
        variant="contained"
        size="large"
        css={css`
          margin: 1rem auto;
          width: 80%;
          font-size: 1.25rem;
        `}
        onClick={() => navigate("/project/create-post")}
      >
        New Project
      </Button>
      <List>
        {menus.map(({ text, to, icon }, index) => (
          <ListItem key={index} disablePadding sx={{ height: "72px" }}>
            <ListItemButton onClick={() => navigate(to)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{ fontSize: "24px" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["ログアウト"].map((text, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{ fontSize: "24px" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ minHeight: { sm: "96px" } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h2" noWrap component="div">
            {title ?? ""}
          </Typography>
          <div
            css={css`
              margin-left: auto;
            `}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle sx={{ fontSize: "52px" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Typography sx={{ fontSize: "20px", margin: "8px 1rem" }}>
                User Name: {session?.userName}
              </Typography>
              <Link to="/mypage">
                <MenuItem sx={{ fontSize: "20px" }}>マイページ</MenuItem>
              </Link>
              <MenuItem
                onClick={handleLogout}
                style={{ color: "red", fontSize: "20px" }}
              >
                ログアウト
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: { sm: "96px" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
