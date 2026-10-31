FROM node:25-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:25-alpine
WORKDIR /app
COPY --from=build /app/dist/inventory-frontend ./dist/inventory-frontend
EXPOSE 4000
CMD ["node", "dist/inventory-frontend/server/server.mjs"]
