FROM node:latest

EXPOSE 3000

WORKDIR /

RUN npm i -g serve

RUN mkdir /app

COPY build /app

CMD ["serve", "-s", "app"]