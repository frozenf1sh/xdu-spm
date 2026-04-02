# --- 第一个 Dockerfile (后端) 优化版 ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# 同样建议删除 lock 文件或确保环境纯净，防止原生模块不匹配
RUN npm install --omit=dev

# --- 运行阶段 ---
FROM node:20-alpine

WORKDIR /app

# 从 builder 拷贝依赖
COPY --from=builder /app/node_modules ./node_modules
# 拷贝所有源代码（这一步很重要，否则容器运行起来找不到 server.js）
COPY . . 

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_DIR=/app/data

EXPOSE 3001
VOLUME ["/app/data"]

CMD ["npm", "start"]
