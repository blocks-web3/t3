#!/bin/bash
BASE_DIR=/workspace
JSON_PATH=$BASE_DIR/bin/database/json/seed
ENDPOINT=http://dynamodb-local:8000

# batch insert
aws --endpoint-url=$ENDPOINT dynamodb batch-write-item  --no-cli-pager --request-items file://$JSON_PATH/quarter.json
aws --endpoint-url=$ENDPOINT dynamodb batch-write-item  --no-cli-pager --request-items file://$JSON_PATH/project.json
aws --endpoint-url=$ENDPOINT dynamodb batch-write-item  --no-cli-pager --request-items file://$JSON_PATH/user.json
aws --endpoint-url=$ENDPOINT dynamodb batch-write-item  --no-cli-pager --request-items file://$JSON_PATH/comment.json
