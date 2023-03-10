/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Typography } from "@mui/material";
import React from "react";

const MainContainer = (props: {
  heading?: string;
  children?: React.ReactNode;
}) => {
  const { heading, children } = props;
  return (
    <div
      css={css`
        /* margin: 2rem 2rem; */
      `}
    >
      {heading && (
        <Typography
          variant="h4"
          noWrap
          component="div"
          css={css`
            margin: 1rem auto;
            text-align: center;
          `}
        >
          {heading}
        </Typography>
      )}
      {children}
    </div>
  );
};

export default MainContainer;
