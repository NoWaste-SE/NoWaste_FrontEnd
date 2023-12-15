# Stage 1
FROM node:20-alpine as builder
WORKDIR /app

COPY . .
RUN rm package-lock.json
RUN yarn install --frozen-lockfile
RUN yarn build

# Stage
FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
