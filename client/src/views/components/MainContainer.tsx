/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import Typography from "@mui/material/Typography";
import React from "react";

const MainContainer = (props: {
  heading?: string;
  children?: React.ReactNode;
  containerCss?: SerializedStyles;
  headingCss?: SerializedStyles;
}) => {
  const { heading, children, headingCss, containerCss } = props;
  return (
    <div
      css={css`
        /* margin: 2rem 2rem; */
        ${containerCss}
      `}
    >
      {heading && (
        <Typography
          variant="h2"
          noWrap
          component="div"
          css={css`
            margin: 1rem auto;
            text-align: center;
            ${headingCss}
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
