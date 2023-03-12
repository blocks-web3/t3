/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import grey from "@mui/material/colors/grey";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor, Viewer } from "@toast-ui/react-editor";
import { useEffect, useRef, useState } from "react";
import {
  CommentInput,
  createComment,
  getCommentsByProjectId,
} from "../../api/comment";
import { Comment, Member, Project } from "../../api/types/model";
import { useSession } from "../../auth/AuthContext";
import {
  formatIsoStringWithTime,
  numberFormat,
} from "../../lib/utils/format-util";

interface Props {
  project: Project | undefined;
  members: Member[] | undefined;
}

const ProjectDetailsTab = (props: Props) => {
  const { project, members } = props;
  const [comments, setComments] = useState<Comment[]>([]);
  const contentsRef = useRef<Editor>(null);
  const { session } = useSession();

  useEffect(() => {
    if (!project) return;
    const fetch = async () => {
      const comments = await getCommentsByProjectId(project!.project_id);
      if (!comments) return;
      setComments(comments);
    };
    fetch();
  }, [project, props.project]);

  const onSubmit = async () => {
    const markdown = contentsRef.current?.getInstance().getMarkdown();
    if (!markdown) return;
    const req: CommentInput = {
      projectId: project!.project_id,
      session: session!,
      comment: markdown,
    };
    const data = await createComment(req);
    if (!data) return;
    setComments((prev) => [...prev, data]);
  };

  return (
    <>
      <Box>
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
        <Typography
          variant="h5"
          align="left"
          css={css`
            font-weight: 600;
          `}
        >
          Contents
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
              initialValue={project?.proposal?.content}
              usageStatistics={false}
            ></Viewer>
          )}
        </Box>
      </Box>
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
        <form action="submit">
          <Box>
            <Editor
              initialValue=" "
              usageStatistics={false}
              previewStyle="vertical"
              height="auto"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              ref={contentsRef}
              autofocus={false}
            />
          </Box>
          <div
            css={css`
              display: flex;
              justify-content: end;
            `}
          >
            <Button variant="contained" size="large" onClick={onSubmit}>
              Comment
            </Button>
          </div>
        </form>
      </Box>
    </>
  );
};

const CommentItem = (props: { comment: Comment }) => {
  const { comment } = props;
  return (
    <div>
      <Box
        css={{
          borderWidth: "1px",
          borderColor: grey[400],
          borderStyle: "solid",
          borderRadius: "4px",
          padding: "16.5px 14px;",
        }}
      >
        <Viewer initialValue={comment.comment} usageStatistics={false}></Viewer>
      </Box>
      <Box
        css={css`
          display: flex;
          margin: 0.5rem 0.5rem 3rem 0.5rem;
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
      </Box>
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
