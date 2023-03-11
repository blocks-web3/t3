/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";
import grey from "@mui/material/colors/grey";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import BigNumber from "bignumber.js";
import { useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { postProject, PostProjectInput } from "../../../api/project";
import { useSession } from "../../../auth/AuthContext";
import { useLoading } from "../../../loading/LoadingContext";
import { createProjectContract } from "../../../wallet/wallet-util";
import MainContainer from "../../components/MainContainer";

type FormValues = {
  title: string;
};
const CreatePost: React.FC = () => {
  const { session } = useSession();
  const editorRef = useRef<Editor>(null);
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const [markDown, setMarkdown] = useState<string | undefined>(
    getSavedContents()
  );
  // const editorRef = useRef<Editor>(null) as LegacyRef<Editor> | undefined;

  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormValues>({
    criteriaMode: "all",
  });

  const handleFormOnSubmit: SubmitHandler<FormValues> = async (
    data: FormValues
  ) => {
    if (!session) {
      return;
    }
    setLoading(true);
    const markdown = editorRef.current?.getInstance().getMarkdown();
    try {
      const projectId = uuidv4();
      const result = await createProjectContract(session, projectId, 123);
      const input: PostProjectInput = {
        session: session,
        title: data.title,
        content: markdown || "",
        requiredTokenNumber: new BigNumber("4"),
        projectId: projectId,
        contractAddress: result.projectAddress,
        ownerAddress: result.owner,
      };
      const response = await postProject(input);
      saveContents(undefined);
      setMarkdown(undefined);
      navigate("/project/list");
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function onChangeContents() {
    const markdown = editorRef.current?.getInstance().getMarkdown();
    saveContents(markdown);
    setMarkdown(markdown);
  }

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
        <form action="submit" onSubmit={handleSubmit(handleFormOnSubmit)}>
          <FormControl
            required
            error={!!errors["title"]}
            component="fieldset"
            fullWidth
            style={{ marginBottom: "30px" }}
          >
            <FormLabel component="legend">Title</FormLabel>

            <FormHelperText>
              {errors?.title ? errors?.title.message?.toString() : undefined}
            </FormHelperText>
            <Controller
              name="title"
              control={control}
              rules={{ required: "入力してください" }}
              render={({ field }) => (
                <TextField {...field} variant="outlined" />
              )}
            />
          </FormControl>
          <Editor
            initialValue={markDown}
            previewStyle="vertical"
            height="auto"
            minHeight="400px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            onChange={onChangeContents}
            ref={editorRef}
          />
          <input type="submit"></input>
        </form>
      </div>
    </MainContainer>
  );
};

export default CreatePost;

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
