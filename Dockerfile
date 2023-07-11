FROM node:lts as Builder

WORKDIR /worker

COPY ./ /worker

RUN yarn install && yarn add serve && yarn build

###################################################################################
############################## Build clear app image ##############################

FROM node:lts-alpine

COPY --from=Builder /worker /worker
WORKDIR /worker

RUN npm install --global serve

CMD ["npm", "run", "serve"]