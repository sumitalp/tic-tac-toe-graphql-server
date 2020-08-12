FROM node:12-alpine

WORKDIR /home/nodejs/app
RUN chown -R node:node .
USER node
RUN chmod 755 .

COPY --chown=node:node ./ .

RUN yarn config set ignore-engines true
RUN yarn

ENV NODE_ENV=production
RUN yarn build

EXPOSE 4000

CMD [ "yarn", "start" ]
