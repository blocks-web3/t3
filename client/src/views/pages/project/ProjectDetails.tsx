/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import Box from "@mui/material/Box";
import grey from "@mui/material/colors/grey";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectByID, getProjectMembersByID } from "../../../api/project";
import { Member, Project } from "../../../api/types/model";
import { formatIsoString, numberFormat } from "../../../lib/utils/format-util";
import HiddenText from "../../components/atoms/HiddenText";
import MainContainer from "../../components/MainContainer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProjectDetails: React.FC = () => {
  const [project, setProject] = useState<Project>();
  const [members, setMembers] = useState<Member[]>();
  const { projectId } = useParams();
  useEffect(() => {
    if (!projectId) return;

    const fetch = async () => {
      const project = await getProjectByID(projectId);
      const members = await getProjectMembersByID(projectId);
      setProject(project);
      setMembers(members);
    };
    fetch();
  }, [projectId]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <MainContainer
      heading={project?.proposal?.title ?? "No Title"}
      headingCss={css`
        display: flex;
        justify-content: start;
      `}
      containerCss={css`
        border: solid 1.5px;
        border-radius: 10px;
        border-color: ${grey[300]};
        padding: 2rem;
      `}
    >
      <div
        css={css`
          border: solid 1.5px;
          border-radius: 10px;
          border-color: ${grey[300]};
          padding: 2rem;
        `}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Item One" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
        <Typography
          variant="h4"
          align="left"
          css={css`
            margin: 2rem 0;
            width: 100%;
          `}
        >
          Project Details
        </Typography>
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
      </div>
    </MainContainer>
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

export default ProjectDetails;
