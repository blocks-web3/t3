FROM node:18.14-bullseye

RUN apt-get update -y && \
  apt install -y sudo \
  curl \
  less

RUN wget "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -O "awscliv2.zip"
RUN unzip awscliv2.zip
RUN sudo ./aws/install

RUN npm install -g pnpm

USER node
WORKDIR /workspace

RUN git config --global --add safe.directory /workspace

RUN mkdir -p -m 0755 ~/.aws
RUN { \
  echo "[default]"; \
  echo "aws_access_key_id = default"; \
  echo "aws_secret_access_key = default"; \
  } >> ~/.aws/credentials
RUN { \
  echo "[default]"; \
  echo "region = ap-northeast-1"; \
  echo "output = json"; \
  } >> ~/.aws/config