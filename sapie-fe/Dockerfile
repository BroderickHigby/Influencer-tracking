FROM node:8

RUN mkdir /srv/app
WORKDIR /srv/app

ADD package.json /srv/app/package.json
RUN npm install --silent
RUN npm install -g serve --silent

COPY . ./
RUN npm run build --silent

EXPOSE 5000
CMD ["serve", "-s", "build"]
