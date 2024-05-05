FROM node:20.11.1 AS build

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json /usr/src/app

# Set environment to development
ENV NODE_ENV=development

# Install dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . /usr/src/app

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app
CMD ["npm", "run", "start"]