
FROM node:18-alpine

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install \
    && ls -al node_modules/react-scripts \
    && npm cache clean --force

COPY . .

RUN npm run build && npm install -g serve

CMD ["serve", "-s", "build"]