FROM node as build

WORKDIR /build

COPY . .

RUN npm ci

RUN npm run build

FROM nginx:alpine

COPY --from=build /build/dist/spa /usr/share/nginx/html

COPY docker/nginx.conf /temp/prod.conf
RUN envsubst /app < /temp/prod.conf > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

