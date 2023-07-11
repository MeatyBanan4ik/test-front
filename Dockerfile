FROM node:lts as Builder

COPY ./ /frontend

WORKDIR /frontend

RUN make build

RUN yarn build

###################################################################################
############################## Build clear app image ##############################

FROM node:lts-alpine

COPY --from=Builder /frontend /frontend

WORKDIR /frontend
