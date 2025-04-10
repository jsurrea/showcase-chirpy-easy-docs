# Set the base image to use for subsequent instructions
FROM node:slim

# Define versions explicitly to comply with hadolint
ENV BUNDLER_VERSION=2.6.2 \
    JEKYLL_VERSION=4.4.1

# Install dependencies, update npm, and install Ruby gems in one RUN layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git=1:2.39.5-0+deb12u2 \
    ruby-full=1:3.1 \
    build-essential=12.9 \
    zlib1g-dev=1:1.2.13.dfsg-1 && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g npm@latest && \
    gem install bundler:$BUNDLER_VERSION jekyll:$JEKYLL_VERSION

# Setup working directory
WORKDIR /app

# Copy the action code
COPY . .

# Set the entrypoint script
ENTRYPOINT ["node", "/app/dist/index.js"]
