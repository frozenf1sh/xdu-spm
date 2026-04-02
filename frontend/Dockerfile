# --- 阶段一：构建阶段 ---
FROM node:20-alpine AS builder

WORKDIR /app

# 1. 复制依赖定义文件
COPY package*.json ./

# 2. 关键步骤：删除本地 lock 文件并安装依赖
# 这能强制 npm 根据当前的 Alpine Linux 环境下载对应的二进制补丁
RUN npm install

# 3. 复制所有源代码并执行打包
COPY . .
RUN npm run build

# --- 阶段二：运行阶段 ---
FROM nginx:alpine

# 4. 从构建阶段拷贝生成的静态文件到 Nginx 目录
# 注意：Vite 默认输出目录是 dist，请确保与你的 vite.config.js 配置一致
COPY --from=builder /app/dist /usr/share/nginx/html

# 5. 复制自定义 Nginx 配置和启动脚本
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

# 6. 赋予启动脚本执行权限
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
