import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export function LoadingMask() {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme: { zIndex: { modal: number } }) =>
          theme.zIndex.modal + 1,
      }}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
