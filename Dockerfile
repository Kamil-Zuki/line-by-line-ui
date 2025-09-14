# --------------------
# 1) Builder stage
# --------------------
FROM node:20-slim AS builder
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
# Copy the rest of the project
COPY . .


# Build the application (if necessary - depends on your build process)
RUN npm run build

# Stage for the production environment
FROM node:20-slim AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
# Copy the rest of the project
COPY . .


# Expose the port
EXPOSE 3000
CMD ["npm", "start"]
```

