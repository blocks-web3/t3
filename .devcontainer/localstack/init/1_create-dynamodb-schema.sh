#!/bin/bash

# テーブルを作成
awslocal dynamodb create-table --cli-input-json file:///json/project.json
awslocal dynamodb create-table --cli-input-json file:///json/comment.json
awslocal dynamodb create-table --cli-input-json file:///json/quarter.json
awslocal dynamodb create-table --cli-input-json file:///json/user.json

# テーブル一覧を表示
awslocal dynamodb list-tables
