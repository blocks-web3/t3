/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { TextField, Typography } from "@mui/material";
import grey from "@mui/material/colors/grey";
import MainContainer from "../../components/MainContainer";

const CreatePost: React.FC = () => {
  return (
    <MainContainer heading="Create Post">
      <div
        css={css`
          border: solid 1.5px;
          border-radius: 10px;
          border-color: ${grey[300]};
          padding: 2rem;
          justify-content: start;
          display: flex;
        `}
      >
        <form
          action="submit"
          css={css`
            width: 100%;
          `}
        >
          <Typography
            variant="h5"
            align="left"
            css={css`
              margin: 0 0 0.5rem;
              width: 100%;
            `}
          >
            Target Quarter
          </Typography>
          <TextField
            id="outlined-basic"
            placeholder="202301Q"
            variant="outlined"
            css={css`
              width: 50%;
              text-align: left !important;
            `}
          />
          <Typography
            variant="h5"
            align="left"
            css={css`
              margin: 2rem 0 0.5rem;
              width: 100%;
            `}
          >
            Project Title
          </Typography>
          <TextField
            id="outlined-basic"
            placeholder="最強のカイゼン提案"
            variant="outlined"
            fullWidth
          />
        </form>
      </div>
    </MainContainer>
  );
};

export default CreatePost;
