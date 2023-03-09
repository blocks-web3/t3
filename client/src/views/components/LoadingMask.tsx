import { Backdrop, CircularProgress } from "@mui/material";

export function LoadingMask({ open = true, handleClose = () => {} }) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme: { zIndex: { drawer: number } }) =>
          theme.zIndex.drawer + 1,
      }}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
