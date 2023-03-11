import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { Session } from "../auth/AuthContext";
import { ddbClient } from "./dynamodb-client";
import {
  createCommentInput,
  getCommentsByProjectIdInput,
} from "./types/input-type";
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

export type CommentInput = {
  projectId: string;
  session: Session;
  comment: string;
};
export const createComment = async (input: CommentInput) => {
  const comment: Comment = {
    comment_id: uuidv4(),
    project_id: input.projectId,
    author_name: input.session.userName,
    author_address: input.session.address,
    comment: input.comment,
    created_at: new Date().toUTCString(),
    updated_at: new Date().toUTCString(),
  };
  const marshalled = marshall(comment);
  try {
    await ddbClient.send(new PutItemCommand(createCommentInput(marshalled)));
    return comment;
  } catch (err) {
    console.error("Error", err);
  }
};
