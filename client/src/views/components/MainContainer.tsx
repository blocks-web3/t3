/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import React from "react";

const MainContainer = (props: {
  children?: React.ReactNode;
  containerCss?: SerializedStyles;
}) => {
  const { children, containerCss } = props;
  return (
    <div
      css={css`
        /* margin: 2rem 2rem; */
        ${containerCss}
      `}
    >
      {children}
    </div>
  );
};

export default MainContainer;
