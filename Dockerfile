# Set the base image to use for subsequent instructions
FROM node:slim

# Set the environment variables for the build
ENV GIT_VERSION=2.49.0 \
    RUBY_VERSION=3.4.2 \
    BUNDLER_VERSION=2.6.7 \
    JEKYLL_VERSION=4.4.1 \
    NPM_VERSION=11.3.0

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git=${GIT_VERSION} \
    ruby-full=${RUBY_VERSION} \
    build-essential=12.10ubuntu1 \
    zlib1g-dev=1:1.2.11.dfsg-2ubuntu9 && \
    rm -rf /var/lib/apt/lists/*
RUN gem install bundler -v ${BUNDLER_VERSION} && \
    gem install jekyll -v ${JEKYLL_VERSION}
RUN npm install -g npm@${NPM_VERSION}

# Setup working directory
WORKDIR /app

# Copy the action code
COPY . .

# Set the entrypoint script (to be implemented later)
ENTRYPOINT ["node", "/app/dist/index.js"]
