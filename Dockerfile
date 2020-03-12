FROM node:10.13.0
#RUN apk --no-cache add --virtual builds-deps build-base python
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
ENV PORT 8080
EXPOSE 8080
CMD ["npm", "run", "start"]


# RUN npm run start