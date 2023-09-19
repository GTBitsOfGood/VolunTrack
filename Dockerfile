FROM node:14

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Start the application
CMD ["npm", "run", "dev"]
