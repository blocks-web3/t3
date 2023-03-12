/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import grey from "@mui/material/colors/grey";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Viewer } from "@toast-ui/react-editor";
import { useState } from "react";
import { Project } from "../../api/types/model";

interface Props {
  project: Project | undefined;
}

const ProjectOutcomeTab = (props: Props) => {
  const { project } = props;
  const [evaluated, setEvaluated] = useState(false);

  const evaluation = {
    for: {
      val: 25,
    },
    against: {
      val: 175,
    },
    total: 200,
  };

  const handleEvaluation = (isFor: boolean) => {
    // evaluate method should be called here!!
    setEvaluated(true);
  };

  return (
    <Box>
      <Box
        css={css`
          margin: 2rem 0;
        `}
      >
        <Typography
          variant="h5"
          align="left"
          css={css`
            font-weight: 600;
            margin-bottom: 1rem;
          `}
        >
          Evaluation
        </Typography>
        <Box
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Typography
            variant="h5"
            align="left"
            css={css`
              margin-right: auto;
            `}
          >
            {"Let's evaluate this project!! -> -> ->"}
          </Typography>
          <div>
            <Button
              variant="contained"
              css={css`
                height: 3rem;
                width: 6rem;
                margin-right: 1rem;
              `}
              onClick={() => handleEvaluation(true)}
              disabled={evaluated}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="secondary"
              css={css`
                height: 3rem;
                width: 6rem;
              `}
              onClick={() => handleEvaluation(false)}
              disabled={evaluated}
            >
              Reject
            </Button>
          </div>
        </Box>
      </Box>
      <Box
        css={css`
          margin: 2rem 0;
        `}
      >
        <Typography
          variant="h5"
          align="left"
          css={css`
            font-weight: 600;
            margin-bottom: 1rem;
          `}
        >
          Result
        </Typography>
        <Box css={css``}>
          <LinearProgress
            variant="determinate"
            value={(evaluation.for.val / evaluation.total) * 100}
            color="primary"
            css={css`
              height: 1.5rem;
              border-radius: 5;
            `}
          />
          <Box
            css={css`
              display: flex;
              justify-content: space-between;
            `}
          >
            <Typography variant="h6" css={css``}>
              {`Accept: ${
                Math.floor((evaluation.for.val / evaluation.total) * 1000) / 10
              } %`}
            </Typography>
            <Typography variant="h6" css={css``}>
              {`Reject: ${
                Math.floor((evaluation.against.val / evaluation.total) * 1000) /
                10
              } %`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        css={css`
          margin: 2rem 0;
        `}
      >
        <Typography
          variant="h5"
          align="left"
          css={css`
            font-weight: 600;
            margin-bottom: 1rem;
          `}
        >
          Outcome Report
        </Typography>
        <Box
          css={{
            borderWidth: "1px",
            borderColor: grey[400],
            borderStyle: "solid",
            borderRadius: "4px",
            padding: "16.5px 14px;",
          }}
        >
          {project?.proposal?.content && (
            <Viewer
              initialValue={project?.result?.content}
              usageStatistics={false}
            ></Viewer>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectOutcomeTab;
