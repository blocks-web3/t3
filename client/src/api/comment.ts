import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./dynamodb-client";
import { getCommentsByProjectIdInput } from "./types/input-type";
import { Comment } from "./types/model";

export const getCommentsByProjectId = async (projectId: string) => {
  try {
    const data = await ddbClient.send(
      new QueryCommand(getCommentsByProjectIdInput(projectId))
    );
    const comments = data.Items?.map((i) => unmarshall(i)) as Comment[];
    return comments;
  } catch (err) {
    console.error("Error", err);
  }
};
