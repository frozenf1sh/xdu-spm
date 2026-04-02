# 图书馆管理系统 (Library Management System)

> **项目名称**: XDU Library Management System
> **版本**: Release 1 (R1)
> **状态**: ✅ 已完成

---

## 📋 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [Release 1 范围](#release-1-范围)
- [软件过程](#软件过程)
- [快速开始](#快速开始)
- [演示账号](#演示账号)
- [项目结构](#项目结构)
- [API文档](#api文档)

---

## 📖 项目概述

本项目是一个基于Web的图书馆管理系统（LMS），采用敏捷开发方法进行开发。系统支持三种用户角色：**读者（Reader）**、**管理员（Admin）**和**图书管理员（Librarian）**，每个角色拥有不同的功能权限。

---

## 🛠️ 技术栈

| 层级 | 技术选型 |
|------|----------|
| **前端** | React 18 + Vite + React Router + TailwindCSS |
| **后端** | Node.js + Express.js |
| **数据库** | SQLite 3 |
| **通信** | RESTful APIs |
| **架构** | Monorepo (`/frontend` + `/backend`) |

---

## 🎯 Release 1 范围

### 用户故事映射

| 角色 | 用户故事 | 状态 |
|------|----------|------|
| **Reader** | Story 1.1: 用户注册 | ✅ |
| **Reader** | Story 1.2: 用户登录 | ✅ |
| **Reader** | Story 1.3: 搜索图书（按书名/作者） | ✅ |
| **Reader** | Story 1.4: 查看图书详情 | ✅ |
| **Reader** | Story 1.7: 更新个人资料 | ✅ |
| **Admin** | Story 1.5: 添加新图书到目录 | ✅ |
| **Admin** | Story 1.6: 管理用户账户（查看所有用户、启用/禁用账户） | ✅ |
| **Librarian** | Story R1 Demo: 图书管理员仪表板（查看完整图书目录、筛选图书） | ✅ |

### 功能模块

#### 1. 读者功能模块
- 用户认证（注册/登录）
- 图书搜索（支持书名和作者关键词）
- 图书详情查看
- 个人资料管理

#### 2. 管理员功能模块
- 用户账户管理（用户列表、启用/禁用账户）
- 图书管理（添加新图书）

#### 3. 图书管理员功能模块
- 完整图书目录查看
- 按状态筛选图书（全部/可借阅/已借出）
- 图书统计（总数、可借阅数、已借出数）

---

## 🔄 软件过程

### Git 分支策略

本项目采用 **Feature Branch Workflow** 配合 **Gitflow** 最佳实践：

```
main
  ├── feature/R1-auth
  ├── feature/R1-book-catalog
  ├── feature/R1-user-management
  ├── feature/R1-frontend-setup
  ├── feature/R1-reader-dashboard
  ├── feature/R1-admin-dashboard
  └── feature/R1-librarian-dashboard
```

### Git 提交历史

| 提交哈希 | 提交信息 | 说明 |
|----------|----------|------|
| `ca48789` | Merge branch 'feature/R1-librarian-dashboard' | 合并图书管理员仪表板 |
| `ee57f27` | feat(librarian): implement librarian dashboard | 实现图书管理员仪表板 |
| `5b7513b` | Merge branch 'feature/R1-admin-dashboard' | 合并管理员仪表板 |
| `195f8ac` | feat(admin): implement admin dashboard | 实现管理员仪表板 |
| `54b6adc` | Merge branch 'feature/R1-reader-dashboard' | 合并读者仪表板 |
| `f826fba` | feat(reader): implement reader dashboard | 实现读者仪表板 |
| `640beb0` | Merge branch 'feature/R1-frontend-setup' | 合并前端初始化 |
| `fdb7699` | feat(frontend): initialize React + Vite + Tailwind | 初始化前端项目 |
| `51f88ca` | Merge branch 'feature/R1-user-management' | 合并用户管理API |
| `445e55c` | feat(users): implement user management APIs | 实现用户管理API |
| `03c17ff` | Merge branch 'feature/R1-book-catalog' | 合并图书目录API |
| `edc0a5f` | feat(books): implement book catalog APIs | 实现图书目录API |
| `835041a` | Merge branch 'feature/R1-auth' | 合并认证功能 |
| `53ca949` | feat(auth): implement registration and login API | 实现注册登录API |
| `d7f97ac` | feat(db): setup SQLite schema and mock data | 初始化数据库和Mock数据 |
| `faf1d67` | feat(backend): initialize backend project | 初始化后端项目 |

### 提交规范

本项目遵循 **Conventional Commits** 规范：

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式调整 |
| `refactor` | 重构 |

---

## 🚀 快速开始

### 前置要求

- Node.js >= 16
- npm 或 yarn

### 安装与运行

#### 1. 启动后端服务

```bash
cd backend
npm install
npm start
```

后端服务将在 `http://localhost:3001` 启动

#### 2. 启动前端服务

打开新的终端窗口：

```bash
cd frontend
npm install
npm run dev
```

前端服务将在 `http://localhost:3000` 启动

### 数据库

系统使用 SQLite，数据库文件会在首次运行时自动创建并填充Mock数据：
- 位置：`backend/library.db`
- 包含：3个用户、10本图书

---

## 👤 演示账号

所有账号的密码均为：`123456`

| 角色 | 邮箱 | 说明 |
|------|------|------|
| 读者 | `reader@library.com` | 可搜索图书、查看详情、更新资料 |
| 管理员 | `admin@library.com` | 可管理用户、添加图书 |
| 图书管理员 | `librarian@library.com` | 可查看完整书目、筛选图书 |

---

## 📁 项目结构

```
xdu-spm/
├── backend/
│   ├── package.json
│   ├── database.js          # SQLite 数据库初始化
│   ├── server.js            # Express 服务器 + REST API
│   └── library.db           # SQLite 数据库文件（运行时生成）
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx         # 应用入口
│       ├── App.jsx          # 路由配置
│       ├── index.css        # Tailwind 样式
│       ├── contexts/
│       │   └── AuthContext.jsx    # 认证状态管理
│       ├── services/
│       │   └── api.js              # API 请求封装
│       ├── pages/
│       │   ├── Login.jsx           # 登录页
│       │   ├── ReaderDashboard.jsx # 读者仪表板
│       │   ├── AdminDashboard.jsx  # 管理员仪表板
│       │   └── LibrarianDashboard.jsx # 图书管理员仪表板
│       └── components/
│           ├── BookDetail.jsx      # 图书详情弹窗
│           └── ProfileModal.jsx    # 个人资料弹窗
├── .gitignore
└── README.md
```

---

## 📡 API 文档

### 认证接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | `/api/register` | 用户注册 | 否 |
| POST | `/api/login` | 用户登录 | 否 |

### 图书接口

| 方法 | 路径 | 描述 | 认证 | 角色 |
|------|------|------|------|------|
| GET | `/api/books` | 获取图书列表（支持 `?search=` 查询） | 否 | - |
| GET | `/api/books/:id` | 获取图书详情 | 否 | - |
| POST | `/api/books` | 添加新图书 | 是 | Admin |

### 用户接口

| 方法 | 路径 | 描述 | 认证 | 角色 |
|------|------|------|------|------|
| GET | `/api/users` | 获取所有用户 | 是 | Admin |
| PUT | `/api/users/:id` | 更新用户信息 | 是 | Admin/Owner |
| GET | `/api/users/profile` | 获取当前用户资料 | 是 | 任一 |

---

## 📊 Release 1 验收清单

- [x] 后端Express服务正常运行
- [x] SQLite数据库和Mock数据初始化
- [x] RESTful API实现完整
- [x] JWT认证机制实现
- [x] 前端React + Vite项目初始化
- [x] 登录/注册页面实现
- [x] 读者仪表板（图书搜索、详情、个人资料）
- [x] 管理员仪表板（用户管理、添加图书）
- [x] 图书管理员仪表板（书目查看、筛选）
- [x] Git分支管理规范
- [x] 提交信息符合Conventional Commits

---

## 📝 开发团队

- 角色：学生项目团队
- 课程：软件工程

---

**© 2024 XDU Library Management System Team**
