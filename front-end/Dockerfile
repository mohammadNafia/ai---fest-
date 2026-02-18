# Build stage
FROM node:18.20.8-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Set build-time environment variables (Vite needs these at build time)
# Default to production API URL, can be overridden by build args
ARG VITE_API_URL=https://aidevfest-site-777jj.ondigitalocean.app/api
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
