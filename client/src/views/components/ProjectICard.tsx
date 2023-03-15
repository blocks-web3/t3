/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useTheme } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Project } from "../../api/types/model";
import { resolveStatus, shortenAddress } from "../../lib/utils/format-util";

type Props = {
  project: Project;
};

export default function ProjectCard(props: Props) {
  const { project } = props;
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card
      sx={{
        minWidth: 275,
        margin: "1rem auto",
        backgroundColor: "rgb(232, 234, 246, 0.5)",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/project/details/${project.project_id}`)}
    >
      <CardContent
        css={css`
          padding: 2rem;
        `}
      >
        <Typography
          variant="h5"
          css={css`
            display: inline-block;
            border-radius: 2rem;
            background-color: ${theme.palette.primary.light};
            padding: 0.6rem 1.2rem;
            /* max-width: 10rem; */
            color: white;
            text-align: center;
            margin: 0 0 1rem;
          `}
        >
          {resolveStatus(project.status)}
        </Typography>
        <Typography variant="h2" component="div">
          {project.proposal?.title ?? ""}
        </Typography>
        <Typography
          variant="h6"
          css={css`
            margin: 0.5rem 0;
          `}
        >
          {shortenAddress(project.contract_address)}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {project.created_at.toString()}
        </Typography>
      </CardContent>
    </Card>
  );
}
