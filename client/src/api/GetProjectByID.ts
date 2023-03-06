import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./dynamodb-client";
import { createGetProjectByIDInput } from "./types/input-type";

export const getProjectByID = async (projectId: string) => {
  try {
    const data = await ddbClient.send(
      new QueryCommand(createGetProjectByIDInput(projectId))
    );
    console.log("Success :", data);
    return data.Items;
  } catch (err) {
    console.log("Error", err);
  }
};
