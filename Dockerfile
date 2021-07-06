FROM node:14-alpine as builder

RUN apk update && apk add yarn curl bash python g++ make && rm -rf /var/cache/apk/*
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /app

COPY package*.json ./ tsconfig.json ./
COPY src ./src

RUN npm ci
RUN npm run build

# prune unnecessary files from the node_modules folder
RUN /usr/local/bin/node-prune

RUN npm ci --production

FROM node:14-alpine as production

WORKDIR /app
COPY package*.json ./

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080
CMD npm start
