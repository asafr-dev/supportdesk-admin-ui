# Multi-stage build: Vite -> static files, then Nginx for serving + /api reverse-proxy.

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

# Railway sets PORT at runtime. Default is 80 for local docker runs.
ENV PORT=80

# Default upstream for Railway private networking.
# Override by setting API_UPSTREAM (service variable).
ENV API_UPSTREAM=http://supportdesk-api.railway.internal:8080

# Nginx official image will envsubst any /etc/nginx/templates/*.template into /etc/nginx/conf.d/
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
