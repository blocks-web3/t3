# T3プロジェクト

## 開発環境

DevContainerで構築する場合は以下。  

- Docker DeskTopのインストール  
  - https://docs.docker.com/desktop/install/mac-install/
  - https://docs.docker.com/desktop/install/windows-install/
  - https://docs.docker.com/desktop/install/linux-install/

- VSCodeのインストール(最新バージョン推奨)  
  - https://azure.microsoft.com/ja-jp/products/visual-studio-code

- DevContainerのVSCodeプラグインをインストール  
  -  https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers

- DevContainerの起動
```
git clone https://github.com/blocks-web3/t3.git

VSCodeでt3フォルダを開く

CTRL + SHIT + P -> Dev Containers: Rebuild and Reopen in Container
```

## AWSコマンド
### `t3-node` container から localstack へ dynamodb コマンド
- list tables
```
aws --endpoint-url=http://localstack:4566 dynamodb list-tables
```

- describe table
```
aws --endpoint-url=http://localstack:4566 dynamodb describe-table \
    --table-name quarter
```

- delete table
```
aws --endpoint-url=http://localstack:4566 dynamodb delete-table \
    --table-name quarter
```

- put item
```
aws --endpoint-url=http://localstack:4566 dynamodb put-item \
    --table-name quarter  \
    --item \
    '{"quarter":{"S":"2023Q1"},"propose_due_datetime":{"S":"2023-03-10"}}'
```

- delete item
```
aws --endpoint-url=http://localstack:4566 dynamodb delete-item \
    --table-name quarter \
    --key '{"quarter":{"S":"2023Q1"}}'
```

- 参考
  - https://zenn.dev/marumarumeruru/articles/6aeb25bd27063a#localstack%E3%81%AEdynamodb%E3%81%AE%E6%93%8D%E4%BD%9C%E6%96%B9%E6%B3%95