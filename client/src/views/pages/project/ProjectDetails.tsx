import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { useEffect, useState } from "react";
import { getProjectByID } from "../../../api/GetProjectByID";

const ProjectDetails: React.FC = () => {
  const [project, setProject] = useState<
    Record<string, AttributeValue>[] | undefined
  >(undefined);
  useEffect(() => {
    getProjectByID("1").then((project) => {
      setProject(project);
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
