# Set the base image to use for subsequent instructions
FROM node:slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    ruby-full \
    build-essential \
    zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

# Update npm to the latest version
RUN npm install -g npm@latest

# Install bundler and jekyll
RUN gem install bundler jekyll

# Setup working directory
WORKDIR /app

# Copy the action code
COPY . .

# Set the entrypoint script (to be implemented later)
ENTRYPOINT ["node", "/app/dist/index.js"]
