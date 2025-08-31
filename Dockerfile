# Use the official Node.js 20 image (Next.js 15.4 recommends Node.js 18 or later)
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install dependencies
# Copy package.json and package-lock.json (or yarn.lock/pnpm-lock.yaml if used)
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]