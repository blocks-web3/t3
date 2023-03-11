/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import grey from "@mui/material/colors/grey";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommentsByProjectId } from "../../../api/comment";
import { getProjectByID, getProjectMembersByID } from "../../../api/project";
import { Comment, Member, Project } from "../../../api/types/model";
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
  const [comments, setComments] = useState<Comment[]>();
  const { projectId } = useParams();

  useEffect(() => {
    if (!projectId) return;

    const fetch = async () => {
      const [project, members, comments] = await Promise.all([
        getProjectByID(projectId),
        getProjectMembersByID(projectId),
        getCommentsByProjectId(projectId),
      ]);

      setProject(project);
      setMembers(members);
      setComments(comments);
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
        <TabPanel value={value} index={0} title="Project Details">
          <ProjectDetailsTab
            project={project}
            members={members}
            comments={comments}
          />
        </TabPanel>
        <TabPanel value={value} index={1} title="Vote Result">
          <VoteTab />
        </TabPanel>
        <TabPanel value={value} index={2} title="Project Outcome">
          <ProjectOutcomeTab />
        </TabPanel>
        <TabPanel value={value} index={3} title="Evaluation Result">
          <EvaluationTab />
        </TabPanel>
      </div>
    </MainContainer>
  );
};

export default ProjectDetails;
