FROM node:alpine AS builder

WORKDIR /app
COPY . .

RUN npm install -g npm \
    && npm install --legacy-peer-deps \
    && npm run build

# ---------------------------

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]