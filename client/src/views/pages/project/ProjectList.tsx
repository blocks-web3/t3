import { useEffect, useState } from "react";
import { getProjects } from "../../../api/project";
import { Project } from "../../../api/types/model";
import ProjectCard from "../../components/ProjectICard";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>();
  useEffect(() => {
    getProjects().then((projects) => {
      return setProjects(projects);
    });
  }, []);
  return (
    <div>
      {projects?.map((project, index) => {
        return <ProjectCard key={index} project={project} />;
      })}
    </div>
  );
};

export default ProjectList;
