/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import Box from "@mui/material/Box";
import grey from "@mui/material/colors/grey";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Comment, Member, Project } from "../../api/types/model";
import {
  formatIsoString,
  formatIsoStringWithTime,
  numberFormat,
} from "../../lib/utils/format-util";
import HiddenText from "./atoms/HiddenText";

interface Props {
  project: Project | undefined;
  members: Member[] | undefined;
  comments: Comment[] | undefined;
}

const ProjectDetailsTab = (props: Props) => {
  const { project, members, comments } = props;

  return (
    <>
      <Box>
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
          <HiddenText
            text={project?.proposal?.content ?? "-"}
            maxLength={200}
          />
        </ProjectItem>
        <ProjectItem
          label="Created Datetime"
          value={
            project?.created_at ? formatIsoString(project?.created_at) : "-"
          }
        ></ProjectItem>
        <ProjectItem
          label="Updated Datetime"
          value={
            project?.updated_at ? formatIsoString(project?.updated_at) : "-"
          }
        ></ProjectItem>
      </Box>
      <hr
        css={css`
          color: ${grey[300]};
          margin: 2rem auto 3rem;
        `}
      />
      <Box>
        <Typography
          variant="h4"
          align="left"
          css={css`
            margin: 2rem 0;
            width: 100%;
          `}
        >
          Comments
        </Typography>
        {comments?.map((comment) => {
          return <CommentItem key={comment.comment_id} comment={comment} />;
        })}
      </Box>
    </>
  );
};

const CommentItem = (props: { comment: Comment }) => {
  const { comment } = props;
  return (
    <div>
      <div
        css={css`
          display: flex;
          margin: 0.5rem auto;
        `}
      >
        <Typography variant="h6">{`${comment.author_name} (${comment.author_address})`}</Typography>
        <Typography
          css={css`
            margin-left: auto;
          `}
        >
          {formatIsoStringWithTime(comment.created_at)}
        </Typography>
      </div>
      <Typography>{comment.comment}</Typography>
      <hr
        css={css`
          background-color: ${grey[300]};
          border: none;
          height: 1px;
          margin: 0.5rem auto 1.5rem;
        `}
      />
    </div>
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
