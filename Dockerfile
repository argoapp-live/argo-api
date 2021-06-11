FROM node:14-alpine as builder

WORKDIR /app

COPY package*.json ./ tsconfig.json ./
COPY src ./src

RUN npm ci
RUN npm run build

RUN npm ci --production

FROM node:14-alpine as production

WORKDIR /app
COPY package*.json ./

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080
CMD npm start
