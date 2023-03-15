/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import grey from "@mui/material/colors/grey";
import Typography from "@mui/material/Typography";
import React from "react";

const MainContainer = (props: {
  title?: string;
  children?: React.ReactNode;
  containerCss?: SerializedStyles;
}) => {
  const { children, containerCss, title } = props;
  return (
    <div
      css={css`
        border: solid 1.5px;
        border-radius: 10px;
        border-color: ${grey[300]};
        padding: 2rem;
        ${containerCss}
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: start;
          align-items: center;
        `}
      >
        <Typography
          variant="h2"
          noWrap
          component="div"
          css={css`
            margin: 1rem 0;
            text-align: left;
          `}
        >
          {title ?? ""}
        </Typography>
      </div>
      {children}
    </div>
  );
};

export default MainContainer;
