import { useEffect, useState } from "react";
import { getProjectByID } from "../../../api/project";
import { Project } from "../../../api/types/model";

const ProjectDetails: React.FC = () => {
  const [project, setProject] = useState<Project>();
  useEffect(() => {
    getProjectByID("1").then((projects) => {
      setProject(projects ? projects[0] : undefined);
    });
  }, []);
  return (
    <div>
      ProjectDetails
      <div>{JSON.stringify(project)}</div>
    </div>
  );
};

export default ProjectDetails;
