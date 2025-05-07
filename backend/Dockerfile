FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./prisma prisma
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production


RUN npm run generate
COPY . .
EXPOSE 3000

RUN npm run build
CMD [ "node", "dist/index.js" ]


