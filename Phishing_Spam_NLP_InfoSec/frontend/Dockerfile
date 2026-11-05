FROM node:20-alpine

WORKDIR /app

# Step 1: Install dependencies
COPY package*.json ./
RUN npm install

# Step 2: Copy source files and build Next.js app
COPY . .
RUN npm run build

# Step 3: Expose port and start Next.js
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
