/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProjectByID,
  getProjectMembersByID,
  postResult,
} from "../../../api/project";
import { Member } from "../../../api/types/model";
import { useSession } from "../../../auth/AuthContext";
import { isProjectMember } from "../../../lib/utils/validator";
import { useLoading } from "../../../loading/LoadingContext";
import MainContainer from "../../components/MainContainer";

const CreateOutcome: React.FC = () => {
  const { session } = useSession();
  const contentsRef = useRef<Editor>(null);
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const [markDown, setMarkdown] = useState<string | undefined>(
    getSavedContents()
  );
  const [members, setMembers] = useState<Member[]>();
  const { projectId } = useParams();

  const isMember = useCallback(
    (members: Member[]) => {
      return isProjectMember(members, session);
    },
    [session]
  );

  useEffect(() => {
    if (!projectId) return;

    const fetch = async () => {
      const [project, members] = await Promise.all([
        getProjectByID(projectId),
        getProjectMembersByID(projectId),
      ]);
      if (!members) return;

      setMembers(members);
      saveContents(project?.result?.content);
      setMarkdown(project?.result?.content);

      if (!isMember) return navigate(`/project/details/${projectId}`);
    };
    fetch();
  }, [isMember, navigate, projectId, session?.address]);

  const handleSubmit = async () => {
    if (!session || !projectId || (members && !isMember(members))) return;

    setLoading(true);
    const markdown = contentsRef.current?.getInstance().getMarkdown();
    try {
      await postResult({ projectId, result: markdown || "" });
      saveContents(undefined);
      setMarkdown(undefined);
      navigate(`/project/details/${projectId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function onChangeContents() {
    const markdown = contentsRef.current?.getInstance().getMarkdown();
    saveContents(markdown);
    setMarkdown(markdown);
  }

  return (
    <MainContainer title="Update Project Outcome">
      <div
        css={css`
          margin-top: 2rem;
        `}
      >
        <Stack spacing={2}>
          <Box>
            <p
              css={css`
                margin-bottom: 1rem;
              `}
            >
              <FormLabel>Write Outcome</FormLabel>
            </p>
            <Editor
              initialValue={markDown}
              usageStatistics={false}
              previewStyle="vertical"
              height="auto"
              minHeight="400px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              onChange={onChangeContents}
              ref={contentsRef}
              autofocus={false}
            />
          </Box>
          <Button
            type="submit"
            size="large"
            color="primary"
            variant="contained"
            onClick={handleSubmit}
          >
            Send
          </Button>
        </Stack>
      </div>
    </MainContainer>
  );
};

export default CreateOutcome;

function getSavedContents(): string | undefined {
  return window.localStorage.getItem("contents") || "";
}

function saveContents(contents: string | null | undefined): void {
  if (!contents) {
    window.localStorage.removeItem("contents");
  } else {
    window.localStorage.setItem("contents", contents);
  }
}
