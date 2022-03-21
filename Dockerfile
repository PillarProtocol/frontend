# Stage 1 build
FROM node:12.22.5-buster as base

RUN cd ~ && mkdir app

COPY package.json /home/app/package.json
COPY yarn.lock /home/app/yarn.lock
WORKDIR /home/app
COPY . /home/app
RUN yarn install
RUN yarn build

#Stage 2 build
FROM node:12.22.5-alpine
WORKDIR /usr/src/app
RUN yarn global add serve
COPY package.json .
COPY --from=base /home/app/build ./build
EXPOSE 5000

CMD [ "yarn", "serve" ]
