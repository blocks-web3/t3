/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const HiddenText = (props: { text: string; maxLength?: number }) => {
  const { text, maxLength = 100 } = props;
  const needsFolded = text.length > maxLength;
  const [expanded, setExpanded] = useState(false);

  return (
    <Typography
      css={css`
        white-space: pre-wrap;
      `}
    >
      {needsFolded && !expanded ? text.substring(0, maxLength) : text}
      {needsFolded && (
        <button
          onClick={() => setExpanded(!expanded)}
          css={css`
            border: none;
            background-color: transparent;
            padding: 0;
            :active,
            :focus {
              border: none;
              outline: none;
            }
          `}
        >
          <Typography color="textPrimary">
            {expanded ? " ...Show less" : " ...Show more"}
          </Typography>
        </button>
      )}
    </Typography>
  );
};

export default HiddenText;
