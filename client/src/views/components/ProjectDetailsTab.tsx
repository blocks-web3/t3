/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Card, CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import grey from "@mui/material/colors/grey";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Editor, Viewer } from "@toast-ui/react-editor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommentInput,
  createComment,
  getCommentsByProjectId,
} from "../../api/comment";
import { Comment, Member, Project } from "../../api/types/model";
import { useSession } from "../../auth/AuthContext";
import {
  formatIsoStringWithTime,
  resolveProjectMembers,
} from "../../lib/utils/format-util";
import { isProjectMember } from "../../lib/utils/validator";
import { useLoading } from "../../loading/LoadingContext";
import { t3BalanceOf, voteT3Token } from "../../wallet/wallet-util";
import "../css/toastui-editor.css";

interface Props {
  project: Project | undefined;
  members: Member[] | undefined;
}

const ProjectDetailsTab = (props: Props) => {
  const { project, members } = props;
  const [comments, setComments] = useState<Comment[]>([]);
  const contentsRef = useRef<Editor>(null);
  const { session } = useSession();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [votedT3Balance, setVotedT3Balance] = useState(0);
  const [myT3Balance, setMyT3Balance] = useState(0);
  const [voteTokenInput, setVoteTokenInput] = useState("");
  const { setLoading } = useLoading();

  const refreshBalance = useCallback(() => {
    if (session) {
      t3BalanceOf(session, project!.contract_address).then((balance) => {
        setVotedT3Balance(balance);
      });
      t3BalanceOf(session, session?.address).then((balance) => {
        setMyT3Balance(balance);
      });
    }
  }, [project, session]);

  useEffect(() => {
    if (!project) return;
    const fetch = async () => {
      getCommentsByProjectId(project!.project_id).then((comments) => {
        if (comments) {
          setComments(comments);
        }
      });
      refreshBalance();
    };
    fetch();
  }, [project, refreshBalance, session]);

  const voteProgress = useMemo(() => {
    const number =
      votedT3Balance && project?.proposal?.required_token_number
        ? (votedT3Balance / project.proposal.required_token_number) * 100
        : 0;
    return Math.min(number, 100);
  }, [project?.proposal?.required_token_number, votedT3Balance]);

  const onSubmitComment = async () => {
    const markdown = contentsRef.current?.getInstance().getMarkdown();
    if (!markdown) return;
    const req: CommentInput = {
      projectId: project!.project_id,
      session: session!,
      comment: markdown,
    };
    try {
      setLoading(true);
      const data = await createComment(req);
      if (!data) return;
      setComments((prev) => [...prev, data]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitVoteDialogOpen = async () => {
    setDialogOpen(true);
  };

  const handleDialogClose = async () => {
    setDialogOpen(false);
  };

  const onSubmitVoteToken = async () => {
    const value = Number.parseInt(voteTokenInput);
    if (canVote()) {
      try {
        setLoading(true);
        await voteT3Token(session!, project!.contract_address, value);
        setDialogOpen(false);
        refreshBalance();
      } finally {
        setLoading(false);
      }
    }
  };

  const canVote = useCallback(() => {
    return session && project?.project_id;
  }, [project?.project_id, session]);

  const dialogItem = (
    <Dialog
      open={dialogOpen}
      maxWidth="sm"
      fullWidth
      onClose={handleDialogClose}
    >
      <div
        css={css`
          padding: 2rem 2rem;
        `}
      >
        <DialogTitle variant="h3">Vote T3 token to this project</DialogTitle>
        <hr
          css={css`
            margin-left: 1rem;
            margin-right: 1rem;
          `}
        />
        <DialogContent>
          <Grid
            container
            css={css`
              margin: 2rem 0 3rem;
            `}
          >
            <Grid item xs={6}>
              <Typography
                variant="h5"
                align="left"
                css={css`
                  font-weight: 600;
                `}
              >
                My Token Balance
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="h5"
                align="right"
                css={css`
                  white-space: pre-wrap;
                `}
              >
                {`${myT3Balance}  T3`}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            css={css`
              margin: 2rem 0;
            `}
          >
            <Grid
              item
              xs={6}
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              <Typography
                variant="h5"
                align="left"
                css={css`
                  font-weight: 600;
                `}
              >
                Vote Amount
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                type="number"
                autoComplete="off"
                value={voteTokenInput}
                css={css`
                  width: 100%;
                `}
                onChange={(event) => setVoteTokenInput(event.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={handleDialogClose}
            css={css`
              height: 3rem;
              margin-right: 0.75rem;
              margin-left: 1rem;
            `}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onSubmitVoteToken}
            disabled={!canVote}
            css={css`
              margin-right: 1rem;
              height: 3rem;
            `}
          >
            OK
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );

  return (
    <>
      <Box>
        <div
          css={css`
            display: flex;
            margin: 1.5rem auto 3rem;
          `}
        >
          {members && isProjectMember(members, session) ? (
            <Button
              variant="outlined"
              fullWidth
              css={css`
                border-radius: 2rem;
                height: 3rem;
                margin-left: auto;
              `}
              onClick={() =>
                navigate(
                  `/project/details/${project?.project_id}/create-outcome`
                )
              }
            >
              Post Outcome
            </Button>
          ) : (
            <Button
              variant="outlined"
              fullWidth
              css={css`
                border-radius: 2rem;
                height: 3rem;
                margin-left: auto;
              `}
              onClick={onSubmitVoteDialogOpen}
            >
              Vote
            </Button>
          )}
        </div>
        <ProjectItem
          label="Members"
          value={members ? resolveProjectMembers(members) : "TBD"}
        ></ProjectItem>
        <ProjectItem label="Token">
          <Box sx={{ position: "relative" }}>
            <LinearProgress
              variant="determinate"
              value={voteProgress}
              sx={{
                height: 24,
                borderRadius: 5,
                position: "absolute",
                width: "100%",
              }}
            />
            <Typography
              variant="h5"
              align="center"
              color={"white"}
              sx={{
                position: "absolute",
                left: "45%", // いい感じで中央に寄るようにする
              }}
            >
              {votedT3Balance}/{project?.proposal?.required_token_number}
            </Typography>
          </Box>
        </ProjectItem>
        <Typography
          variant="h5"
          align="left"
          css={css`
            font-weight: 600;
            margin-bottom: 1rem;
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
            margin: 4rem 0 0.5rem;
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
              initialValue=" " // 初期値がnullだと謎のデフォルト値が入るのでスペースを入れておく
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
              margin-top: 1rem;
            `}
          >
            <Button variant="contained" size="large" onClick={onSubmitComment}>
              Comment
            </Button>
          </div>
        </form>
      </Box>
      {dialogItem}
    </>
  );
};

const CommentItem = (props: { comment: Comment }) => {
  const { comment } = props;
  return (
    <div>
      <Card sx={{ minWidth: 275, margin: "1rem auto" }}>
        <CardContent
          css={css`
            padding: 1rem 1rem 0.5rem;
            :last-child {
              padding-bottom: 0.5rem;
            }
          `}
        >
          <Box>
            <Viewer
              initialValue={comment.comment}
              usageStatistics={false}
            ></Viewer>
          </Box>
          <div
            css={css`
              height: 1px;
              background-color: ${grey[300]};
              margin: 1rem auto 0;
            `}
          ></div>
          <Box
            css={css`
              display: flex;
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
        </CardContent>
      </Card>
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

export default ProjectDetailsTab;
