/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import grey from "@mui/material/colors/grey";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { postProject, PostProjectInput } from "../../../api/project";
import { User } from "../../../api/types/model";
import { getUsers } from "../../../api/users";
import { useSession } from "../../../auth/AuthContext";
import { useLoading } from "../../../loading/LoadingContext";
import { createProjectContract } from "../../../wallet/wallet-util";
import MainContainer from "../../components/MainContainer";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type FormValues = {
  title: string;
  projectMembers: User[];
  requiredToken: number;
  requiredTotalDays: number;
};

const CreatePost: React.FC = () => {
  const { session } = useSession();
  const contentsRef = useRef<Editor>(null);
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [users, setUsers] = useState<User[]>([]);

  const [markDown, setMarkdown] = useState<string | undefined>(
    getSavedContents()
  );

  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
  } = useForm<FormValues>({
    criteriaMode: "all",
  });

  useEffect(() => {
    async function fetchData() {
      const users = await getUsers();
      if (users) {
        setUsers(users);
      }
    }
    fetchData();
  }, []);

  const handleFormOnSubmit: SubmitHandler<FormValues> = async (
    data: FormValues
  ) => {
    if (!session) {
      return;
    }
    setLoading(true);
    const markdown = contentsRef.current?.getInstance().getMarkdown();
    try {
      const projectId = uuidv4();
      const result = await createProjectContract(session, projectId, 123);
      const input: PostProjectInput = {
        session: session,
        title: data.title,
        projectMembers: data.projectMembers,
        content: markdown || "",
        requiredTokenNumber: data.requiredToken,
        requiredTotalDays: data.requiredTotalDays,
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
    const markdown = contentsRef.current?.getInstance().getMarkdown();
    saveContents(markdown);
    setMarkdown(markdown);
  }

  return (
    <MainContainer>
      <Typography
        variant="h2"
        noWrap
        component="div"
        css={css`
          margin: 1rem auto;
          text-align: center;
        `}
      >
        Create Post
      </Typography>
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
          <Stack spacing={2}>
            <FormControl
              required
              error={!!errors["title"]}
              component="fieldset"
              fullWidth
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
            <FormControl
              required
              error={!!errors["projectMembers"]}
              component="fieldset"
              fullWidth
            >
              <FormLabel component="legend">Member</FormLabel>

              <FormHelperText>
                {errors?.projectMembers
                  ? errors?.projectMembers.message?.toString()
                  : undefined}
              </FormHelperText>
              <Controller
                name="projectMembers"
                control={control}
                rules={{ required: "入力してください" }}
                render={() => (
                  <Autocomplete
                    multiple
                    limitTags={5}
                    options={users}
                    loading={users.length === 0}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.employee_name}
                    onChange={(event, values) => {
                      if (values !== null) {
                        setValue("projectMembers", values, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      }
                    }}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.employee_name}
                      </li>
                    )}
                    renderInput={(params) => <TextField {...params} />}
                  />
                )}
              />
            </FormControl>
            <Box display="flex">
              <FormControl
                required
                error={!!errors["requiredToken"]}
                component="fieldset"
                sx={{ mr: 1, flex: 2 }}
              >
                <FormLabel component="legend">Required Tokens</FormLabel>

                <FormHelperText>
                  {errors?.requiredToken
                    ? errors?.requiredToken.message?.toString()
                    : undefined}
                </FormHelperText>
                <Controller
                  name="requiredToken"
                  control={control}
                  rules={{ required: "入力してください" }}
                  render={({ field }) => <TextField {...field} type="number" />}
                />
              </FormControl>
              <FormControl
                required
                error={!!errors["requiredTotalDays"]}
                component="fieldset"
                sx={{ mr: 1, flex: 2 }}
              >
                <FormLabel component="legend">Required Total Days</FormLabel>
                <FormHelperText>
                  {errors?.requiredTotalDays
                    ? errors?.requiredTotalDays.message?.toString()
                    : undefined}
                </FormHelperText>
                <Controller
                  name="requiredTotalDays"
                  control={control}
                  rules={{ required: "入力してください" }}
                  render={({ field }) => <TextField {...field} type="number" />}
                />
              </FormControl>
            </Box>
            <Box>
              <FormLabel>Contents</FormLabel>
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
            >
              Send
            </Button>
          </Stack>
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
