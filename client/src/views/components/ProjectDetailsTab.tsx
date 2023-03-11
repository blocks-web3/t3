/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Member, Project } from "../../api/types/model";
import { formatIsoString, numberFormat } from "../../lib/utils/format-util";
import HiddenText from "./atoms/HiddenText";

interface Props {
  project: Project | undefined;
  members: Member[] | undefined;
}

const ProjectDetailsTab = (props: Props) => {
  const { project, members } = props;
  return (
    <>
      <ProjectItem
        label="Target Quarter"
        value={project?.quarter ?? "TBD"}
      ></ProjectItem>
      <ProjectItem
        label="Project Members"
        value={members ? resolveProjectMembers(members) : "TBD"}
      ></ProjectItem>
      <ProjectItem label="Token Shares">
        <ProjectSubItem
          label="Required Token"
          value={`${
            project?.proposal?.required_token_number
              ? numberFormat(project?.proposal?.required_token_number)
              : "-"
          } T3`}
        ></ProjectSubItem>
        <ProjectSubItem
          label="Collected Token"
          value={`- T3`}
          css={css`
            margin: 2rem;
          `}
        ></ProjectSubItem>
      </ProjectItem>
      <ProjectItem label="Project Members">
        <HiddenText text={project?.proposal?.content ?? "-"} maxLength={200} />
      </ProjectItem>
      <ProjectItem
        label="Created Datetime"
        value={project?.created_at ? formatIsoString(project?.created_at) : "-"}
      ></ProjectItem>
      <ProjectItem
        label="Updated Datetime"
        value={project?.updated_at ? formatIsoString(project?.updated_at) : "-"}
      ></ProjectItem>
    </>
  );
};

const ProjectItem = (props: {
  label: string;
  children?: React.ReactNode;
  value?: string;
}) => {
  const { label, children, value } = props;

  return (
    <Grid
      container
      css={css`
        margin: 2rem 0;
      `}
    >
      <Grid item xs={3}>
        <Typography
          variant="h5"
          align="left"
          css={css`
            font-weight: 600;
          `}
        >
          {label}
        </Typography>
      </Grid>
      <Grid item xs={9}>
        {value ? (
          <Typography
            variant="h5"
            align="left"
            css={css`
              white-space: pre-wrap;
            `}
          >
            {value}
          </Typography>
        ) : (
          <>{children}</>
        )}
      </Grid>
    </Grid>
  );
};

const ProjectSubItem = (props: {
  label: string;
  value: string;
  css?: SerializedStyles;
}) => {
  const { label, value } = props;
  // console.log(cssProp);
  return (
    <Grid
      container
      css={css`
        margin-bottom: 1rem;
      `}
    >
      <Grid item xs={3}>
        <Typography variant="h5" align="left" css={css``}>
          {`${label}: `}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="h5" align="right" css={css``}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
};

const resolveProjectMembers = (members: Member[]) => {
  let result = "";
  members
    .sort((a, b) => (b.member_role === "PROPOSER" ? 1 : -1))
    .forEach((member: Member) => {
      if (result) {
        result += ", ";
      }
      switch (member.member_role) {
        case "PROPOSER":
          result += `P.${member.member_name}`;
          break;
        case "COLLABORATOR":
          result += `C.${member.member_name}`;
          break;
        default:
          result += `${member.member_name}`;
          break;
      }
    });
  return result;
};

export default ProjectDetailsTab;
