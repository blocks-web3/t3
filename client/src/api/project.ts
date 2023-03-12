import {
  BatchWriteItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Session } from "../auth/AuthContext";
import { ddbClient } from "./dynamodb-client";
import {
  createGetProjectByIDInput,
  createGetProjectMembersByIDInput,
  getProjectsInput,
  postResultInput,
} from "./types/input-type";
import { Member, Project, User } from "./types/model";

export const getProjectByID = async (projectId: string) => {
  try {
    const data = await ddbClient.send(
      new QueryCommand(createGetProjectByIDInput(projectId))
    );
    const projects = data.Items?.map((i) => unmarshall(i)) as Project[];
    return !projects.length ? undefined : projects[0];
  } catch (err) {
    console.error("Error", err);
  }
};

export const getProjectMembersByID = async (projectId: string) => {
  try {
    const data = await ddbClient.send(
      new QueryCommand(createGetProjectMembersByIDInput(projectId))
    );
    const members = data.Items?.map((i) => unmarshall(i)) as Member[];
    return members;
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
  projectMembers: User[];
  session: Session;
  title: string;
  content: string;
  requiredTokenNumber: number;
  requiredTotalDays: number;
  contractAddress: string;
  ownerAddress: string;
};

export const postProject = async (input: PostProjectInput) => {
  const projectItemRequest = {
    PutRequest: {
      Item: {
        project_id: { S: input.projectId },
        project_member_address: { S: `PJ#${input.projectId}` },
        type: { S: "pj" },
        status: { S: "PROPOSAL" },
        quarter: { S: "2023Q1" },
        contract_address: { S: input.contractAddress },
        created_at: { S: new Date().toUTCString() },
        updated_at: { S: new Date().toUTCString() },
        proposal: {
          M: {
            title: { S: input.title },
            content: {
              S: input.content,
            },
            hiring_number: { N: "3" },
            required_token_number: {
              N: input.requiredTokenNumber,
            },
            required_total_days: {
              N: input.requiredTotalDays,
            },
            impl_period_from_date: { S: "2023-03-10" },
            impl_period_to_date: { S: "2023-03-19" },
          },
        },
      },
    },
  };
  const projectProposer = {
    PutRequest: {
      Item: {
        project_id: { S: input.projectId },
        project_member_address: { S: `USER#${input.session.address}` },
        type: { S: "user" },
        member_name: { S: input.session.userName },
        member_role: {
          S: "PROPOSER",
        },
      },
    },
  };

  const projectCollaborator = input.projectMembers.map((user: User) => {
    return {
      PutRequest: {
        Item: {
          project_id: { S: input.projectId },
          project_member_address: { S: `USER#${user.wallet_address}` },
          type: { S: "user" },
          member_name: { S: user.employee_name },
          member_role: {
            S: "COLLABORATOR",
          },
        },
      },
    };
  });
  try {
    const post = new BatchWriteItemCommand({
      RequestItems: {
        project: [projectItemRequest, projectProposer, ...projectCollaborator],
      },
    });
    const data = await ddbClient.send(post);
    return data;
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
};

export type PostResultInput = {
  projectId: string;
  result: string;
};

export const postResult = async (input: PostResultInput) => {
  try {
    await ddbClient.send(
      new UpdateItemCommand(postResultInput(input.projectId, input.result))
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};
