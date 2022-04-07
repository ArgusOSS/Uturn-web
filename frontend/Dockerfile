FROM node:lts-alpine3.14 as frontend-build
WORKDIR /opt/uturn/frontend
COPY . .
WORKDIR /opt/uturn/frontend/uturn/
# RUN npm install npm@latest -g
RUN apk --no-cache add nodejs yarn --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
EXPOSE 4200
RUN yarn install
CMD ["yarn", "start", "--host", "0.0.0.0"]

