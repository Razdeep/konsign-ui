FROM node:latest as builder

RUN mkdir source

WORKDIR source

COPY . .

RUN npm install

RUN npm run build --if-present

FROM node:latest

EXPOSE 3000

WORKDIR /

RUN npm i -g serve

RUN mkdir /app

COPY --from=builder /source/build /app

CMD ["serve", "-s", "app"]