FROM node:16.12-alpine3.14 as build

WORKDIR /app

COPY --chown=node:node ["package.json", "package-lock.json*", "./"]
COPY --chown=node:node tsconfig.json .
RUN npm i

COPY --chown=node:node ["src", "*.d.ts", "./src/"]
RUN npm run build

FROM node:16.12-alpine3.14 AS dependencies
WORKDIR /app

COPY --from=build --chown=node:node ["/app/package.json", "/app/package-lock.json*", "./"]
COPY --from=build --chown=node:node /app/build ./
RUN npm ci --only=production

FROM alpine:3.14.2
RUN apk add nodejs --no-cache
WORKDIR /app
COPY --from=dependencies /app/node_modules /app/node_modules
COPY --from=dependencies /app .

CMD [ "node", "server.js" ]