import { useEffect, useState } from "react";
import { getProjects } from "../../../api/project";
import { Project } from "../../../api/types/model";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>();
  useEffect(() => {
    getProjects().then((projects) => {
      return setProjects(projects);
    });
  }, []);
  return (
    <div>
      ProjectList
      <div>{JSON.stringify(projects)}</div>
    </div>
  );
};

export default ProjectList;
