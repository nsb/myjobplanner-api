FROM node:16 as base

WORKDIR /home/node/app

COPY package.json package-lock.json ./

RUN npm i

COPY . .

RUN npm run build

FROM node:16 as production

COPY package.json package-lock.json ./

RUN npm i --only=production

COPY --from=base /home/node/app/build ./build

EXPOSE 3000
CMD [ "npm", "start" ]