# Stage 1: Build the Vite React App
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all the project files
COPY . .

# Build the frontend application
RUN npm run build

# Stage 2: Serve the App using 'serve'
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Install 'serve' globally to host static files
RUN npm install -g serve

# Copy the built assets from the builder stage
COPY --from=builder /app/dist ./dist

# Create a non-root user to run the application (security best practice)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set the port environment variable
ENV PORT=8080
EXPOSE 8080

# Run 'serve' on the dist folder
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:8080"]
