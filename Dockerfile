ARG NODE_VERSION

FROM node:${NODE_VERSION} as Builder

COPY ./ /frontend

WORKDIR /frontend

RUN make build

RUN yarn build

###################################################################################
############################## Build clear app image ##############################

FROM node:${NODE_VERSION}-alpine

COPY --from=Builder /frontend /frontend

WORKDIR /frontend
