FROM node:12.16.1

WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
ENV PORT 8080
EXPOSE 8080
CMD ["npm", "run", "start"]


# RUN npm run start