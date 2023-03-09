import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./dynamodb-client";
import {
  createGetProjectByIDInput,
  getProjectsInput,
} from "./types/input-type";
import { Project } from "./types/model";

export const getProjectByID = async (projectId: string) => {
  try {
    const data = await ddbClient.send(
      new QueryCommand(createGetProjectByIDInput(projectId))
    );
    const projects = data.Items?.map((i) => unmarshall(i)) as Project[];
    return projects;
  } catch (err) {
    console.error("Error", err);
  }
};

export const getProjects = async () => {
  try {
    const data = await ddbClient.send(new QueryCommand(getProjectsInput));
    const projects = data.Items?.map((i) => unmarshall(i)) as Project[];
    return projects;
  } catch (err) {
    console.error("Error", err);
  }
};
