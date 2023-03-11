import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./dynamodb-client";
import { getUsersInput } from "./types/input-type";
import { User } from "./types/model";

export const getUsers = async () => {
  try {
    const data = await ddbClient.send(new ScanCommand(getUsersInput()));
    const users = data.Items?.map((i) => unmarshall(i)) as User[];
    return users;
  } catch (err) {
    console.error("Error", err);
  }
};
