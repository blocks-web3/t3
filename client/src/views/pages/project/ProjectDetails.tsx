/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import grey from "@mui/material/colors/grey";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectByID, getProjectMembersByID } from "../../../api/project";
import { Member, Project } from "../../../api/types/model";
import TabPanel from "../../components/atoms/TabPanel";
import EvaluationTab from "../../components/EvaluationTab";
import MainContainer from "../../components/MainContainer";
import ProjectDetailsTab from "../../components/ProjectDetailsTab";
import ProjectOutcomeTab from "../../components/ProjectOutcomeTab";
import VoteTab from "../../components/VoteTab";

const tabs = [
  {
    index: 0,
    label: "Project Details",
    title: "Project Details",
  },
  {
    index: 1,
    label: "Vote",
    title: "Vote",
  },
  {
    index: 2,
    label: "Project Outcome",
    title: "Project Outcome",
  },
  {
    index: 3,
    label: "Evaluation",
    title: "Evaluation",
  },
];

const ProjectDetails: React.FC = () => {
  const [project, setProject] = useState<Project>();
  const [members, setMembers] = useState<Member[]>();
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;

    const fetch = async () => {
      const [project, members] = await Promise.all([
        getProjectByID(projectId),
        getProjectMembersByID(projectId),
      ]);

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
      containerCss={css`
        border: solid 1.5px;
        border-radius: 10px;
        border-color: ${grey[300]};
        padding: 2rem;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: start;
          align-items: center;
        `}
      >
        <Typography
          variant="h2"
          noWrap
          component="div"
          css={css`
            margin: 1rem 0;
            text-align: left;
          `}
        >
          {project?.proposal?.title ?? "No Title"}
        </Typography>
        <Button
          variant="contained"
          size="small"
          css={css`
            height: 3rem;
            margin-left: auto;
          `}
          onClick={() =>
            navigate(`/project/details/${projectId}/create-outcome`)
          }
        >
          Ready to post outcome?
        </Button>
      </div>
      <div>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            textColor="secondary"
            indicatorColor="secondary"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {tabs.map((tab) => {
              return <Tab key={tab.index} label={tab.label} />;
            })}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ProjectDetailsTab project={project} members={members} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <VoteTab />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ProjectOutcomeTab />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <EvaluationTab />
        </TabPanel>
      </div>
    </MainContainer>
  );
};

export default ProjectDetails;
