#!/bin/bash
BASE_DIR=/workspace
JSON_PATH=$BASE_DIR/bin/database/json
ENDPOINT=http://dynamodb-local:8000

# テーブルを削除
aws --endpoint-url=$ENDPOINT dynamodb delete-table --table-name user
aws --endpoint-url=$ENDPOINT dynamodb delete-table --table-name quarter
aws --endpoint-url=$ENDPOINT dynamodb delete-table --table-name comment
aws --endpoint-url=$ENDPOINT dynamodb delete-table --table-name project

# テーブルを作成
aws --endpoint-url=$ENDPOINT dynamodb create-table --cli-input-json file:///$JSON_PATH/project.json
aws --endpoint-url=$ENDPOINT dynamodb create-table --cli-input-json file:///$JSON_PATH/comment.json
aws --endpoint-url=$ENDPOINT dynamodb create-table --cli-input-json file:///$JSON_PATH/quarter.json
aws --endpoint-url=$ENDPOINT dynamodb create-table --cli-input-json file:///$JSON_PATH/user.json

aws --endpoint-url=$ENDPOINT dynamodb list-tables
