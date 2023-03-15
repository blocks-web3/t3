/** @jsxImportSource @emotion/react */
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectByID, getProjectMembersByID } from "../../../api/project";
import { Member, Project } from "../../../api/types/model";
import TabPanel from "../../components/atoms/TabPanel";
import MainContainer from "../../components/MainContainer";
import ProjectDetailsTab from "../../components/ProjectDetailsTab";
import ProjectOutcomeTab from "../../components/ProjectOutcomeTab";

const tabs = [
  {
    index: 0,
    label: "Project Details",
    title: "Project Details",
  },
  {
    index: 1,
    label: "Project Outcome",
    title: "Project Outcome",
  },
];

const ProjectDetails: React.FC = () => {
  const [project, setProject] = useState<Project>();
  const [members, setMembers] = useState<Member[]>();
  const { projectId } = useParams();

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
    <MainContainer title={project?.proposal?.title ?? ""}>
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
          <ProjectOutcomeTab project={project} />
        </TabPanel>
      </div>
    </MainContainer>
  );
};

export default ProjectDetails;
