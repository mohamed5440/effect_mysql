FROM node:20

WORKDIR /app

# Install build tools for native dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDeps for build)
RUN npm install

# Copy project files
COPY . .

# Build the project
# This generates dist/server.js and static assets in dist/
RUN npm run build

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start"]
