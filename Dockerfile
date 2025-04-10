# Set the base image to use for subsequent instructions
FROM node:slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y git ruby-full build-essential zlib1g-dev && \
    gem install bundler jekyll && \
    npm install -g npm

# Setup working directory
WORKDIR /app

# Copy the action code
COPY . .

# Set the entrypoint script (to be implemented later)
ENTRYPOINT ["node", "/app/dist/index.js"]
