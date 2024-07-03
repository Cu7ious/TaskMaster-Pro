FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i --silent
RUN npm install -g nodemon
COPY . .
EXPOSE 3000
EXPOSE 9229
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "dev"]
