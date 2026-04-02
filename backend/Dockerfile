FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY database.js ./
COPY server.js ./

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

VOLUME ["/app/data"]

CMD ["npm", "start"]
