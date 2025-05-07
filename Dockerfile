FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Environment variables that need to be set at runtime
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start the application
CMD ["npm", "start"]