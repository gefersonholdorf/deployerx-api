FROM node:lts-alpine
WORKDIR /src
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3333
CMD ["npm", "run", "prod"]