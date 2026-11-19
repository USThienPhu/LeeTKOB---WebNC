FROM node:20-alpine AS install
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM install AS build
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS run
ENV NODE_ENV=production
WORKDIR /app
# The existing runner launches isolated containers through the Docker daemon.
RUN apk add --no-cache docker-cli
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
