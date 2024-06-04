FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json /usr/src/app

RUN npm install --force

# Set environment to development
ENV NODE_ENV=development

COPY . /usr/src/app

CMD ["npm", "start"]