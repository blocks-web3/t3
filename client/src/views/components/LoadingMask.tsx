import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

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
