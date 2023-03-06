import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const DEFAULT_REGION = "localhost";
const ENDPOINT = "http://localhost:8000";

export const ddbClient = new DynamoDBClient({
  region: DEFAULT_REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: "default",
    secretAccessKey: "default",
  },
});
