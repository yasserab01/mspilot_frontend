# Node image as the base image
FROM node:20.12.2 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your application code
COPY . ./

CMD ["npm", "start"]