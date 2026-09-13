# 🗺️ 技术栈学习总地图（TECH STACK MAP）

> 一份文件看全整个技术栈：学什么、学到哪了、笔记在哪、项目做没做。
> 进度图例：`[x]` 已完成 ｜ `[-]` 进行中 ｜ `[ ]` 未开始

---

## 一、总览（一眼看全）

| 阶段   | 技术栈                     | 目标             | 状态                     |
| ------ | -------------------------- | ---------------- | ------------------------ |
| 阶段一 | Python + SQLite + 数据分析 | 毕业论文数据能力 | `[-]` 进行中           |
| 阶段二 | 前端三件套 + 设计          | 做出好看网页     | `[ ]`                  |
| 阶段三 | 后端                       | 前后端串起来     | `[ ]`                  |
| 阶段四 | GIS                        | 地理数据可视化   | `[ ]`                  |
| 阶段五 | 自动化 / AI 工具           | 自动化工作流     | `[ ]` 已会用，持续深入 |

**难度梯度（从易到难）：**
HTML/CSS < Python < JavaScript < 数据分析 < 后端

**铁律：一次只专注一条线，不贪多、不同时开多条线。**

---

## 二、阶段一：Python + SQLite + 数据分析（当前）

> 对应目录：`stage-01-python-data/`（basics / data-structures / projects / data-analysis / api-automation）

### 1. Python 基础语法 `[-]`

- [X] 变量、字符串、类型转换
- [X] 条件判断、循环、break/continue
- [X] 函数（def/参数/return）
- [X] 数字运算（算术/比较/赋值/%///）
- [ ] 列表 list
- [ ] 字典 dict
- [ ] 元组 tuple / 集合 set
- [ ] 文件读写 + CSV
- [ ] 异常处理 try/except

**笔记入口：** [python-notes.md](notes/python/python-notes.md) ｜ [errors.md](notes/errors.md) ｜ [built-in-functions.md](notes/python/built-in-functions.md)

**实战项目：**

- [X] 猜数字游戏（projects/guess-game/game.py）
- [X] 小练习集（projects/paper-organizer/：偶数、倍数、斤转千克、闰年、秒转时分秒、温度转换等）

### 2. SQLite（轻量数据库）`[ ]`

> 对应目录：`stage-01-python-data/api-automation/`

- [ ] 建表 / 增删改查（INSERT / SELECT / UPDATE / DELETE）
- [ ] Python 连接 SQLite（sqlite3 模块）
- [ ] 存"学习记录"或"记账"数据

**笔记入口：** `notes/sqlite-notes.md`（待建）

**实战项目：**

- [ ] 记账本：把每天的支出存进数据库，能查询汇总

### 3. 数据分析三件套 `[ ]`

> 对应目录：`stage-01-python-data/data-analysis/`

#### NumPy（数值计算）

- [ ] 数组 ndarray 创建与运算
- [ ] 索引、切片、广播

#### Pandas（表格处理）★毕业论文核心

- [ ] DataFrame 创建与读取（CSV / Excel）
- [ ] 筛选、排序、分组、统计
- [ ] 缺失值处理

#### Matplotlib（画图）

- [ ] 折线图、柱状图、饼图
- [ ] 散点图、直方图

**笔记入口：** `notes/data-analysis-notes.md`（待建）

**实战项目：**

- [ ] 分析湿地公园模拟数据（面积、人流量、周边房价）——毕业论文预演

### 4. Anaconda / 环境管理 `[ ]`

- [ ] conda 创建/切换环境（已有 `py-learn`）
- [ ] 装包：`pip install pandas numpy matplotlib`

**笔记入口：** [conda-notes.md](environment/conda-notes.md)

---

## 三、阶段二：前端三件套 + 设计

> 有博客基础，上手快；先会做"能看"的页面

### 1. HTML5 `[ ]`

- [ ] 常用标签（标题/段落/链接/图片/列表/表格/表单）
- [ ] 语义化标签（header/nav/main/footer）

### 2. CSS3 `[ ]`

- [ ] 选择器、盒模型、布局（flex/grid）
- [ ] 颜色、字体、响应式

### 3. JavaScript `[ ]`

- [ ] 变量、函数、循环（和 Python 对照学）
- [ ] DOM 操作（改网页内容）
- [ ] 事件（点击、输入）

### 4. Figma `[ ]`

- [ ] 画一个页面设计稿
- [ ] 导出设计 → 前端实现

**笔记入口：** `notes/frontend-notes.md`（待建）

**实战项目：**

- [ ] 个人作品集网页（静态）

---

## 四、阶段三：后端

### 1. FastAPI（Python 后端，优先）`[ ]`

- [ ] 路由、请求、响应
- [ ] 返回 JSON、连接数据库

### 2. Node.js / NestJS `[ ]`

- [ ] Node.js 基础（npm、模块）
- [ ] NestJS 或 Express 做 API

**笔记入口：** `notes/backend-notes.md`（待建）

**实战项目：**

- [ ] 把前端作品集 + 后端 API 串成一个完整网站

---

## 五、阶段四：GIS（配合城乡规划专业）

### QGIS + GeoPandas `[ ]`

> 对应目录：`stage-04-gis/`（geopandas / spatial-analysis / urban-data）

- [ ] QGIS 基本操作（加载图层、导出地图）
- [ ] GeoPandas 处理地理数据
- [ ] 湿地公园空间分布可视化

**笔记入口：** `notes/gis-notes.md`（待建）

**实战项目：**

- [ ] 毕业论文：湿地公园案例空间分布图

---

## 六、阶段五：自动化 / AI 工具（已会用，持续深入）

### 1. n8n `[-]`

- [X] 基本工作流（已有使用经验）
- [ ] 结合 Python 脚本节点

### 2. Dify `[-]`

- [X] 基本使用（已有使用经验）
- [ ] 知识库 / 工作流高级功能

### 3. AI Agent 开发 `[-]`

> 对应目录：`stage-05-ai-tools/`。已有一个实战项目，后续深入。

- [X] 多模型编排器（model-orchestrator：DeepSeek 老板 + 多家模型工人）
- [ ] OpenAI 兼容 API 深入
- [ ] LangChain / RAG

**笔记入口：** `stage-05-ai-tools/model-orchestrator/README.md`

---

## 🧰 通用工具箱（不分阶段）

> 任何阶段都会用到的笔记，搬运自 Obsidian 知识库。

| 笔记                                                          | 内容                                 | 什么时候查           |
| ------------------------------------------------------------- | ------------------------------------ | -------------------- |
| [tech-terms-cheatsheet.md](notes/tech-terms-cheatsheet.md)     | 技术术语人话解释 + 易混概念辨析      | 遇到不懂的名词时     |
| [command-line-cheatsheet.md](notes/command-line-cheatsheet.md) | CMD / PowerShell / bash 命令对照速查 | 忘了命令怎么写时     |
| [markdown-cheatsheet.md](notes/markdown-cheatsheet.md)         | Markdown 语法速成                    | 写笔记、写 README 时 |
| [linux-notes.md](environment/linux-notes.md)                   | Linux 用户与 root 权限               | 操作云服务器时       |
| [docker-notes.md](environment/docker-notes.md)                 | Docker 概念与常用命令                | 部署 Dify / 小模型时 |
| [conda-notes.md](environment/conda-notes.md)                   | Conda 环境管理                       | Python 环境出问题时  |

---

## 七、使用说明

1. **每学完一个知识点** → 更新对应 `[ ]` 为 `[x]`，并把新知识记进对应笔记
2. **每个阶段做完实战项目** → 才算真正掌握，进入下一阶段
3. **踩坑** → 记进 `notes/errors.md`，每周回看一遍
4. **进度同步** → 学习日志记在 `notes/learning-log.md`，定期推送到 GitHub
