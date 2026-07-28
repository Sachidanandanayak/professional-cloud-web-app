# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .

# Pass the API URL at build time via Docker build-arg
ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config for React SPA routing (all paths → index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
