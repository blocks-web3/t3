/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  title: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, title, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h4"
            align="left"
            css={css`
              margin: 2rem 0;
              width: 100%;
            `}
          >
            {title}
          </Typography>
          {children}
        </Box>
      )}
    </div>
  );
}
export default TabPanel;
