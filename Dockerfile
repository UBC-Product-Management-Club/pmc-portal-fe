# Stage 1: Build
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Copy Node.js from Alpine
FROM node:20-alpine AS execute

# Copy the built code from the build stage
COPY --from=build /app/dist ./dist

# Copy package.json and package-lock.json
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

# Install only production dependencies
COPY --from=build /app/node_modules ./node_modules

# Install serve to serve the built application
RUN npm install -g serve

# Expose the application port
EXPOSE 3000

# Set the command to serve the built application
CMD ["serve", "-s", "dist"]