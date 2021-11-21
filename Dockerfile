FROM node:latest

WORKDIR /

RUN mkdir /app

COPY build /app

CMD ["serve", "-s", "app"]