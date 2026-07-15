# Stage 1: build the static bundle
FROM node:20-alpine AS build
WORKDIR /src
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: serve with nginx (also proxies /api to the backend container)
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 80
