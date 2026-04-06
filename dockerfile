FROM node:23.4.0-alpine AS builder
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:23.4.0-alpine 
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /src/dist/ ./dist
CMD ["npm", "run", "prod"]
