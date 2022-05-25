FROM node:16.13-alpine
WORKDIR /opt/app
ADD server/package.json server/package.json
ADD client/package.json client/package.json
ADD package.json package.json
RUN yarn initial
RUN yarn global add cross-env
ADD . .
RUN cp front/public/socket/vue-socketio.js front/node_modules/vue-socket.io/dist/
RUN yarn build
RUN npm prune --production
CMD ["yarn", "production:test"]