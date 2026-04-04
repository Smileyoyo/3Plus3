# 3Plus3俱乐部后台管理系统

基于 Vue 3 + Element Plus 的陪玩店后台管理系统，采用 Butterfly 主题风格，支持订单管理、工资结算、打手/VIP管理等功能。

**GitHub 仓库**: https://github.com/Smileyoyo/3Plus3.git

---

## 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [页面说明](#页面说明)
- [权限系统](#权限系统)
- [API 接口](#api-接口)
- [WebSocket 实时通知](#websocket-实时通知)
- [Butterfly 主题说明](#butterfly-主题说明)
- [常见问题](#常见问题)
- [开发指南](#开发指南)
- [TODO](#todo)

---

## 项目简介

3Plus3俱乐部后台管理系统是一套专为陪玩店设计的全功能管理平台，支持订单全流程管理、打手绩效统计、工资智能结算、VIP客户维护等核心业务功能。

系统采用现代化的 Vue 3 + Composition API 开发，前端界面使用独家的 Butterfly 主题设计语言，带来柔和、优雅的美学体验。

---

## 功能特性

### 核心功能

- ✅ **订单管理** - 订单列表、状态流转（待接单/已派单/进行中/已完成/已取消）、多打手接单
- ✅ **工资结算** - 工作室抽成20%、店长抽成5%、鸡腿打赏系统、结算日志
- ✅ **打手管理** - 打手卡片列表、在线状态管理、擅长游戏标签、收入统计
- ✅ **VIP管理** - VIP等级体系（青铜/白银/黄金/铂金/钻石）、标签系统、充值记录
- ✅ **仪表盘** - 实时数据统计、订单趋势图表、在线打手监控
- ✅ **用户管理** - 角色权限管理（管理员/经理/操作员）、操作日志

### 实时功能

- ✅ **WebSocket 通知** - 新订单实时弹窗提醒，左下角蝴蝶飞入动画
- ✅ **状态同步** - 订单状态变更即时推送，打手在线状态实时更新

### 技术特性

- ✅ Vue 3 Composition API + `<script setup>` 语法
- ✅ Pinia 状态管理 + Vue Router 4
- ✅ Element Plus 组件库 + Butterfly 主题覆盖
- ✅ Axios 请求封装 + 请求拦截器
- ✅ WebSocket 实时通信
- ✅ Tailwind CSS v4 原子化样式

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5+ | 渐进式 JavaScript 框架 |
| Vite | 8+ | 下一代前端构建工具 |
| Element Plus | 2.13+ | Vue 3 组件库 |
| Pinia | 3+ | Vue 状态管理 |
| Vue Router | 4+ | Vue 官方路由 |
| Tailwind CSS | 4+ | 原子化 CSS 框架 |
| Axios | 1.14+ | HTTP 请求库 |
| SCSS | - | CSS 预处理器 |

---

## 快速开始

### 环境要求

- **Node.js**: 18.0 或更高版本
- **npm** / **pnpm** / **yarn**: 最新版本

### 1. 克隆仓库

```powershell
git clone https://github.com/Smileyoyo/3Plus3.git
cd 3Plus3/3plus3-club-admin
```

### 2. 安装依赖

```powershell
npm install
```

### 3. 配置后端地址

项目默认代理到 `http://localhost:18789`，如需修改请编辑 `vite.config.js`：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:18789',  // 修改为你的后端地址
      changeOrigin: true
    }
  }
}
```

### 4. 启动开发服务器

```powershell
npm run dev
```

访问 http://localhost:3000 即可进入登录页。

### 5. 构建生产版本

```powershell
npm run build
```

构建产物将输出到 `dist/` 目录。

---

## 项目结构

```
3plus3-club-admin/
├── src/
│   ├── api/                    # API 接口层
│   │   ├── index.js            # Axios 实例配置
│   │   ├── auth.js             # 认证相关 API
│   │   ├── order.js            # 订单相关 API
│   │   ├── player.js           # 打手相关 API
│   │   ├── settlement.js       # 结算相关 API
│   │   ├── vip.js              # VIP 相关 API
│   │   └── mock.js             # Mock 模拟数据
│   ├── assets/                 # 静态资源
│   │   └── butterfly.png       # 蝴蝶装饰素材
│   ├── components/             # 公共组件
│   │   ├── ButterflyCard.vue  # 蝴蝶风格卡片
│   │   ├── GlassNavbar.vue     # 毛玻璃导航栏
│   │   ├── NewOrderToast.vue   # 新订单通知组件
│   │   └── TipsButton.vue      # 鸡腿打赏按钮组
│   ├── composables/            # 组合式函数
│   │   ├── useAuth.js          # 认证逻辑封装
│   │   ├── useWebSocket.js     # WebSocket 连接管理
│   │   └── useDispatch.js      # 派单功能逻辑
│   ├── layouts/                # 布局组件
│   │   ├── MainLayout.vue      # 主布局（侧边栏 + 顶部）
│   │   └── AuthLayout.vue      # 认证布局（登录/注册）
│   ├── router/                 # 路由配置
│   │   └── index.js            # 路由 + 权限守卫
│   ├── stores/                 # Pinia 状态管理
│   │   ├── auth.js             # 用户认证状态
│   │   ├── order.js            # 订单状态管理
│   │   ├── notification.js     # 通知队列管理
│   │   └── player.js           # 打手状态管理
│   ├── styles/                 # 样式文件
│   │   ├── butterfly.scss      # Butterfly 主题核心样式
│   │   ├── globals.css         # Tailwind 全局配置
│   │   └── element-overwrite.scss  # Element Plus 覆盖样式
│   ├── utils/                  # 工具函数
│   │   ├── constants.js        # 常量定义（状态/角色/API端点）
│   │   └── format.js           # 格式化工具（金额/日期）
│   ├── views/                  # 页面视图
│   │   ├── Login.vue           # 登录页
│   │   ├── dashboard/
│   │   │   └── Index.vue       # 仪表盘首页
│   │   ├── order/
│   │   │   └── List.vue        # 订单管理列表
│   │   ├── settlement/
│   │   │   ├── Index.vue       # 工资结算页面
│   │   │   └── Logs.vue        # 结算日志页面
│   │   ├── player/
│   │   │   └── List.vue        # 打手列表页面
│   │   ├── vip/
│   │   │   └── List.vue        # VIP 列表页面
│   │   └── user/
│   │       └── Management.vue  # 用户管理页面
│   ├── App.vue                 # 根组件
│   └── main.js                 # 应用入口
├── public/                     # 公共静态资源
├── index.html                  # HTML 入口
├── package.json
├── vite.config.js              # Vite 配置
└── README.md
```

---

## 页面说明

### 仪表盘 (`/`)

展示核心业务数据，包括：
- 今日订单数、今日流水、待结算工资、在线打手数
- 近7天订单趋势图（ECharts 渐变面积图）
- 实时订单动态列表（WebSocket 驱动）
- 热门游戏分布环形图
- 打手收入排行榜

### 订单管理 (`/order`)

订单全流程管理核心页面：
- **顶部筛选栏**：游戏类型、订单状态、日期范围
- **订单表格**：订单号、打手信息、老板信息、游戏类型、金额、状态
- **状态流转按钮**：
  - 待接单 → 【接单】（选择打手）
  - 已派单 → 自动进入进行中
  - 进行中 → 【存单】/【结单】/【取消】
  - 已完成/已取消 → 【处理】（需权限）

### 工资结算 (`/settlement`)

智能工资结算系统：
- **统计卡片**：待结算总额、本月已结、工作室抽成、店长抽成
- **鸡腿按钮组**：🍗 5 / 🍗 15 / 🍗 20 / 🍗 30 / 🍗 50 / 🍗 100 / ✏️自定义
- **结算表格**：打手、订单号、金额、抽成计算、鸡腿、实发工资
- **一键结算**：确认框显示详细计算过程

**抽成计算公式**：
```
实发工资 = 订单金额 × (1 - 20%工作室 - 5%店长) + 鸡腿
多人打手：剩余金额均分，鸡腿按选择打手均分
```

### 打手列表 (`/player`)

打手卡片网格布局（每行4个）：
- 头像（蝴蝶边框）、昵称、KOOK ID、微信
- 擅长游戏标签（暗区突围/三角洲行动/瓦罗兰特等）
- 完成单数、总收入统计
- 在线状态开关（在线/忙碌/离线）

### VIP列表 (`/vip`)

VIP客户管理：
- 卡片式布局，显示等级徽章
- VIP等级：青铜 → 白银 → 黄金 → 铂金 → 钻石
- 标签系统：常客、大客户、萌新 等
- 累计充值金额、下单次数统计

### 用户管理 (`/user`)

仅管理员可见的用户权限管理：
- 用户列表（账号、角色、状态）
- 角色分配（管理员/经理/操作员）
- 操作日志记录

---

## 权限系统

系统内置四级角色体系，通过路由守卫 + 按钮级指令双重控制。

### 角色定义

| 角色 | 标识 | 权限范围 |
|------|------|---------|
| 管理员 | `admin` | 全部功能 + 用户管理 |
| 经理 | `manager` | 全部功能（除用户管理）|
| 操作员 | `operator` | 订单/VIP/打手（只读）|

### 路由守卫

```javascript
// 路由 meta 配置
meta: { requiresAuth: true, requiresAdmin: true }

// 自动跳转逻辑
// - 未登录 → /login
// - 权限不足 → / (首页)
```

### 按钮级权限

使用 `v-permission` 自定义指令控制按钮显示：

```vue
<el-button v-permission="'order:settle'">结算</el-button>
```

无权限的按钮将自动隐藏。

---

## API 接口

### 接口列表

| 模块 | 方法 | 端点 | 说明 |
|------|------|------|------|
| 认证 | POST | `/api/auth/login` | 用户登录 |
| 认证 | POST | `/api/auth/logout` | 退出登录 |
| 认证 | GET | `/api/auth/user` | 获取用户信息 |
| 订单 | GET | `/api/orders` | 订单列表 |
| 订单 | POST | `/api/orders` | 创建订单 |
| 订单 | PUT | `/api/orders/:id` | 更新订单 |
| 订单 | POST | `/api/orders/:id/assign` | 派单 |
| 打手 | GET | `/api/players` | 打手列表 |
| 打手 | PUT | `/api/players/:id/status` | 更新打手状态 |
| 结算 | GET | `/api/settlements` | 结算列表 |
| 结算 | POST | `/api/settlements/:id/pay` | 执行结算 |
| 结算 | POST | `/api/settlements/:id/tips` | 添加鸡腿 |
| 结算 | GET | `/api/settlements/logs` | 结算日志 |
| VIP | GET | `/api/vips` | VIP列表 |
| 用户 | GET | `/api/users` | 用户列表 |
| 统计 | GET | `/api/stats/dashboard` | 仪表盘数据 |

### 请求示例

```javascript
import { getOrders } from '@/api/order'

// 获取订单列表
const { data } = await getOrders({
  status: 'pending',
  gameType: '暗区突围',
  page: 1,
  pageSize: 20
})
```

---

## WebSocket 实时通知

### 连接管理

使用 `useWebSocket.js` 组合式函数管理连接：

```javascript
import { useWebSocket } from '@/composables/useWebSocket'

const { connect, disconnect, on } = useWebSocket()

// 监听新订单
on('new_order', (order) => {
  console.log('新订单:', order)
})
```

### 事件列表

| 事件 | 说明 | 数据 |
|------|------|------|
| `new_order` | 新订单创建 | 订单详情 |
| `order_update` | 订单状态变更 | 订单ID + 新状态 |
| `player_status_change` | 打手状态变更 | 打手ID + 新状态 |
| `notification` | 系统通知 | 通知内容 |
| `settlement_update` | 结算状态变更 | 结算ID + 新状态 |

### 新订单通知组件

左下角固定位置显示蝴蝶风格通知卡片：
- 标题：`✨ 新订单提醒`
- 内容：订单号 + 游戏类型 + 订单金额
- 操作：【查看详情】/【接单】
- 自动倒计时 5 秒消失，支持手动关闭

---

## Butterfly 主题说明

### 设计规范

| 属性 | 值 | 说明 |
|------|------|------|
| 主色调 | `#B8A9D9` | 淡紫色 |
| 辅色调 | `#F5E6D3` | 奶油色 |
| 强调色 | `#FFB7B2` | 珊瑚粉 |
| 背景渐变 | `#FDF8F5 → #F0EBF8` | 淡粉到淡紫 |
| 毛玻璃 | `blur(12px)` | 导航栏背景 |
| 卡片圆角 | `24px` | 圆润卡片 |
| 按钮圆角 | `40px` | 胶囊按钮 |
| 边框 | `1px rgba(255,255,255,0.3)` | 半透明白边 |

### 订单状态配色

| 状态 | 颜色 | 含义 |
|------|------|------|
| 待接单 | 淡黄色 | 等待处理 |
| 已派单 | 淡蓝色 | 已分配打手 |
| 进行中 | 淡紫色 | 正在进行 |
| 已完成 | 淡绿色 | 订单结束 |
| 已取消 | 淡灰色 | 订单取消 |

### 动画效果

- **页面切换**：淡入淡出 + 轻微缩放
- **卡片悬浮**：上浮 `translateY(-4px)` + 阴影扩大
- **按钮悬浮**：缩放 `scale(1.02)` + 阴影加深
- **新订单弹窗**：蝴蝶从左侧飞入动画
- **数字变化**：CountUp 滚动效果

### 使用方式

```vue
<template>
  <ButterflyCard>
    <h3>订单详情</h3>
    <p>使用 Butterfly 主题卡片</p>
  </ButterflyCard>
</template>

<script setup>
import ButterflyCard from '@/components/ButterflyCard.vue'
</script>
```

---

## 常见问题

### Q1: 启动后页面空白？

**A**: 检查以下几点：
1. 确认已运行 `npm install` 安装依赖
2. 确认 Node.js 版本 >= 18
3. 检查浏览器控制台是否有报错
4. 确认后端服务 `http://localhost:18789` 已启动

### Q2: 登录后跳转到登录页？

**A**: 这通常是 Token 验证失败导致：
1. 检查后端 API 是否正常运行
2. 检查 Token 是否正确存储在 localStorage
3. 查看控制台网络请求是否有 401 错误

### Q3: WebSocket 连接失败？

**A**: 
1. 确认后端 WebSocket 服务已启动
2. 检查浏览器是否阻止了 WebSocket 连接
3. 确认代理配置正确（Vite 开发环境）

### Q4: 如何添加新的游戏类型？

**A**: 修改 `src/utils/constants.js` 中的游戏类型常量，并同步更新后端数据库。

### Q5: 鸡腿系统如何计算多人分成？

**A**: 
- 订单金额 100 元，扣 20%工作室(20元) + 5%店长(5元) = 剩余 75 元
- 2 个打手：每人 37.5 元
- 鸡腿：选择哪些打手，鸡腿金额就均分给哪些打手

### Q6: 如何导出结算报表？

**A**: 在结算日志页面，支持按日期范围筛选和导出功能（开发中）。

---

## 开发指南

### 添加新页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/index.js` 中注册路由
3. 在侧边栏菜单配置中添加菜单项

```javascript
{
  path: 'new-page',
  name: 'NewPage',
  component: () => import('@/views/NewPage.vue'),
  meta: { title: '新页面', icon: 'Folder' }
}
```

### 添加新 API

在 `src/api/` 目录下创建新的 API 文件：

```javascript
// src/api/example.js
import request from './index'

export const getExample = (params) => {
  return request.get('/example', { params })
}

export const createExample = (data) => {
  return request.post('/example', data)
}
```

### 添加新组件

在 `src/components/` 目录下创建组件，享受 Butterfly 主题预设样式。

### 自定义权限指令

在需要权限控制的按钮上使用 `v-permission` 指令：

```vue
<el-button v-permission="'user:delete'">删除用户</el-button>
```

无权限用户将看不到此按钮。

---

## TODO

### 已完成

- [x] 项目基础框架搭建
- [x] Butterfly 主题设计与实现
- [x] 登录认证与权限系统
- [x] 订单管理全流程
- [x] 工资结算系统
- [x] 打手/VIP 列表管理
- [x] 仪表盘数据展示
- [x] WebSocket 实时通知
- [x] Mock 数据支持

### 待开发

- [ ] Excel 导出功能
- [ ] 完整的后端 API 对接
- [ ] 小程序派单接口对接
- [ ] 歌词显示功能
- [ ] 搜索功能增强
- [ ] 数据可视化增强（ECharts 图表）
- [ ] 移动端适配
- [ ] 深色模式支持

---

## 许可证

MIT License

---

## 联系方式

- **GitHub**: https://github.com/Smileyoyo/3Plus3
- **Issues**: https://github.com/Smileyoyo/3Plus3/issues

---

**最后更新**: 2026-04-04
