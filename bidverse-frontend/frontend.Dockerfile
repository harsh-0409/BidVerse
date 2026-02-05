# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Accept build-time API base and expose it as an ENV so Vite picks it up during build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve production
FROM nginx:alpine
# copy custom nginx config to proxy /api -> backend and enable SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]