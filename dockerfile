FROM node:lts-alpine
WORKDIR /
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3333
RUN npm run db-migrate
CMD ["npm", "run", "prod"]