/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import grey from "@mui/material/colors/grey";
import Typography from "@mui/material/Typography";
import { Viewer } from "@toast-ui/react-editor";
import { Project } from "../../api/types/model";

interface Props {
  project: Project | undefined;
}

const ProjectOutcomeTab = (props: Props) => {
  const { project } = props;
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
