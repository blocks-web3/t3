import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import BigNumber from "bignumber.js";
import { Session } from "../auth/AuthContext";
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

export type PostProjectInput = {
  projectId: string;
  session: Session;
  title: string;
  content: string;
  requiredTokenNumber: BigNumber;
  contractAddress: string;
  ownerAddress: string;
};
export const postProject = async (input: PostProjectInput) => {
  try {
    const post = new PutItemCommand({
      TableName: "project",
      Item: {
        project_id: { S: input.projectId },
        project_member_address: { S: input.ownerAddress },
        type: { S: "pj" },
        status: { S: "PROPOSAL" },
        quarter: { S: "2023Q1" },
        created_at: { S: new Date().toUTCString() },
        updated_at: { S: new Date().toUTCString() },
        proposal: {
          M: {
            title: { S: input.title },
            content: {
              S: input.content,
            },
            hiring_number: { N: "3" },
            required_token_number: { N: input.requiredTokenNumber.toFixed() },
            impl_period_from_date: { S: "2023-03-10" },
            impl_period_to_date: { S: "2023-03-19" },
          },
        },
      },
    });
    const data = await ddbClient.send(post);
    return data;
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
};
