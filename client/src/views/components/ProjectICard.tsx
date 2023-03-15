/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import blue from "@mui/material/colors/blue";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { remark } from "remark";
import strip from "strip-markdown";
import { Project } from "../../api/types/model";
import { useSession } from "../../auth/AuthContext";
import { resolveStatus, shortenAddress } from "../../lib/utils/format-util";
import { t3BalanceOf } from "../../wallet/wallet-util";

type Props = {
  project: Project;
};
const maxDetailsLength = 300;

export default function ProjectCard(props: Props) {
  const { project } = props;
  const navigate = useNavigate();

  const [parsedMarkdown, setParsedMarkdown] = useState("");
  const [votedT3Balance, setVotedT3Balance] = useState<number>(0);
  const { session } = useSession();

  useEffect(() => {
    if (project.proposal?.content) {
      remark()
        .use(strip)
        .process(project.proposal?.content)
        .then((file) => {
          let plainString = String(file);
          if (plainString.length > maxDetailsLength) {
            plainString = plainString
              .substring(0, maxDetailsLength)
              .concat("...");
          }
          setParsedMarkdown(plainString);
        });
    }
  }, [project.proposal?.content]);

  useEffect(() => {
    if (session && project) {
      t3BalanceOf(session, project.contract_address).then((balance) => {
        setVotedT3Balance(balance);
      });
    }
  }, [project, session]);
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

        <Typography variant="h4" component="div">
          {project.proposal?.title ?? ""}
        </Typography>
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignItems={"center"}
          display={"flex"}
          sx={{ p: "10px 0px" }}
        >
          <Box
            justifyContent={"flex-start"}
            alignItems={"center"}
            display={"flex"}
          >
            <Typography
              color="text.secondary"
              variant="body2"
              textAlign={"center"}
              sx={{
                background: blue[300],
                color: "white",
                borderRadius: "3px",
                padding: "0px 6px",
                width: "120px",
              }}
            >
              {project.status ?? ""}
            </Typography>
            <Box
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
              sx={{ p: "2px", minWidth: "100px" }}
            >
              <HowToVoteIcon sx={{ p: "0px 2px" }}></HowToVoteIcon>
              <Typography variant="body1">
                {votedT3Balance}/{project.proposal?.required_token_number}
              </Typography>
            </Box>
            <Box
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
              sx={{ p: "2px", minWidth: "100px" }}
            >
              <ThumbUpAltOutlinedIcon
                sx={{ p: "0px 2px" }}
              ></ThumbUpAltOutlinedIcon>
              <Typography variant="body1">0</Typography>
            </Box>
          </Box>
          <Typography color="text.secondary" variant="body1">
            {new Date(project.created_at).toLocaleString()}
          </Typography>
        </Stack>
        <Typography variant="body2">{parsedMarkdown}</Typography>
      </CardContent>
    </Card>
  );
}
