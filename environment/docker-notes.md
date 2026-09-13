# Docker 学习笔记

> 记录 Docker 学习过程中的关键知识和踩坑经验。
> 开始学习：2026-08-27 ｜ 网课结课：2026-08-29
> 结构：概念 → 环境 → 镜像 → 容器 → 卷 → 网络 → Compose → 实战 → 踩坑
> 🔲 标记 = 网课已学、待回忆填充的内容

## 目录

- [第 1 章 认识 Docker](#第-1-章-认识-docker)
- [第 2 章 安装与环境（Windows）](#第-2-章-安装与环境windows)
- [第 3 章 镜像操作](#第-3-章-镜像操作)
- [第 4 章 容器操作](#第-4-章-容器操作)
- [第 5 章 数据卷（挂载）](#第-5-章-数据卷挂载)
- [第 6 章 容器网络](#第-6-章-容器网络)
- [第 7 章 Docker Compose（舰队模式）](#第-7-章-docker-compose舰队模式)
- [第 8 章 实战项目](#第-8-章-实战项目)
- [第 9 章 踩坑记录](#第-9-章-踩坑记录)
- [第 10 章 待办与待补充](#第-10-章-待办与待补充)

---

## 第 1 章 认识 Docker

### 1.1 Docker 是什么

**Docker 是一个"打包程序 + 运行环境"的工具。** 把程序连同它需要的运行环境（系统组件、依赖、配置）一起打包成一个"标准套餐"（镜像），在任何机器上都能一键跑起来。

**生活比喻：** 就像"菜谱 + 所有食材 + 调料 + 锅具"打包成一份套餐，别人拿到这份套餐，不用准备任何东西，照着就能做出一模一样的菜。

> 核心价值：**"在我电脑上能跑"→ "在哪都能跑"**（解决环境不一致问题）。

### 1.2 核心概念

| 概念            | 通俗解释                                          | 类比                     |
| --------------- | ------------------------------------------------- | ------------------------ |
| 镜像 image      | 打包好的"程序 + 环境 + 配置"，**只读模板**  | 菜谱 + 食材包            |
| 容器 container  | 镜像**跑起来**的实例，互相独立，可启停/删除 | 照着菜谱做出来的那盘菜   |
| 仓库 repository | 存放、分享镜像的地方（最出名：Docker Hub）        | 菜谱图书馆 / 应用商店    |
| 卷 volume       | 把数据存到**容器外**，容器删了数据不丢      | 外置硬盘 / 保险柜 / 冰箱 |
| 网络 network    | 容器之间、容器与外界通信的通道                    | 房间之间的电话线         |

**核心关系一句话：**

> 从仓库拉镜像 → 用镜像跑容器 → 容器间靠网络通信 → 数据用卷保存

**镜像 vs 容器（重点）：**

- 镜像 = "母盘"（模板），只读、可复制无限份
- 容器 = "子盘"（实例），一个镜像能生出多个容器

**⚠️ 新手常见误区：镜像不是"网络镜像站"！**

- 我一开始以为"镜像 = 挂一个网络副本（镜像网站）"——❌ 不对！
- Docker 镜像的英文是 **image**（图像/影像），不是 mirror（镜子/复制品）
- 中文都翻译成"镜像"，把两个完全不同的词搞混了，很正常

**✅ 正确理解：镜像 = 环境在某一瞬间的"快照"（snapshot）**

- 快照 = 某一瞬间的"完整状态记录"：构建那一刻，把"系统+程序+依赖+配置"完整状态定格
- 就像拍立得：装好环境后"咔嚓"拍一张，照片定格那一刻，之后不会再变
- 三个特性：**定格**（只读不变化）、**可恢复**（随时重生成环境）、**可复制**（无限份）

**完整流程：**

```
Dockerfile（菜谱：一步步说明怎么搭环境）
    ↓ 构建
镜像 image（快照：环境在构建那一刻的定格状态）
    ↓ 运行
容器 container（用快照"洗"出来的活实例，正在跑）
```

**一句话：** 镜像 = 环境在某个瞬间的"定格快照"；容器 = 用这个快照洗出来的"活实例"。

### 1.3 Docker vs 虚拟机

**核心区别：虚拟机给每个环境装"完整操作系统"，Docker 共享宿主系统，只隔离程序。**

|          | 虚拟机                     | Docker 容器                  |
| -------- | -------------------------- | ---------------------------- |
| 装系统吗 | 每个装**完整**系统   | **不装**，共享宿主系统 |
| 体积     | 几 GB                      | 几十 MB                      |
| 启动速度 | 分钟级                     | 秒级                         |
| 隔离程度 | 强（像真电脑）             | 轻量隔离                     |
| 类比     | 隔间公寓（每间带完整水电） | 集装箱（共享船的引擎）       |

**虚拟机比喻：** 在一台电脑里用软件"假装"出另一台完整电脑——每间假房间有独立地板、墙、水电表（= 完整操作系统），互不干扰。

### 1.4 虚拟机 vs Docker vs AI 沙箱（三者的隔离区别）

三者都带"隔离"意思，但**隔离的东西完全不同**：

|                    | 虚拟机                 | Docker 容器                | AI 沙箱               |
| ------------------ | ---------------------- | -------------------------- | --------------------- |
| **隔离什么** | 整套操作系统           | 应用 + 依赖                | AI 的行为/权限        |
| **层面**     | 硬件模拟               | 应用层                     | 规则约束              |
| **类比**     | 独立公寓（带完整水电） | 共享大楼的住户（共用管道） | 紧箍咒 / 活动范围围栏 |
| **目的**     | 跑不同系统             | 打包部署应用               | 防止 AI 乱来          |
| **重量**     | 重（几 GB）、慢        | 轻（几十 MB）、快          | 无重量（纯规则）      |

**核心一句话：**

> 虚拟机和 Docker 隔离的是**运行环境**（一个是房子，一个是住户）；AI 沙箱隔离的是**行为边界**（是规矩，不是房子）。

**实际使用中三者常叠加出现：**

```
一台云服务器（Linux）
└── 跑着 Docker 容器          ← 应用环境隔离
    └── 容器里跑着 AI Agent    ← AI 在容器里工作
        └── AI 还有沙箱限制     ← 行为权限约束
```

**常见对应：**

- WSL2 = 轻量级虚拟机（本质是微软用 Hyper-V 技术做的轻量虚拟化，跑真正的 Linux 内核）
- Docker = 镜像打包、换机器也能跑
- AI 沙箱（如 TraeCode 里的 trae-sandbox）= AI 越界操作时需要用户授权同意才能执行

---

## 第 2 章 安装与环境（Windows）

### 2.1 三种安装方案

> 结论：**Windows 不需要自己装 Linux 系统也能用 Docker。**

| 方案                                      | 做法                                             | 适用                         |
| ----------------------------------------- | ------------------------------------------------ | ---------------------------- |
| **A. Docker Desktop**（推荐新手）   | 直接安装，底层自动用 WSL2 模拟 Linux，对用户透明 | Windows 10/11                |
| **B. WSL2 + 里面装 Docker**         | 先装 WSL2，再在 Linux 子系统里装 Docker          | 已装 WSL 的用户              |
| **C. 先装 Linux 虚拟机再装 Docker** | VirtualBox/VMware → Ubuntu → 装 Docker         | 最"正宗"但最麻烦，不推荐新手 |

**我的现状：** 电脑已有 WSL，已在 WSL 里装好了 Docker ✅

> 关键认知：**Docker Desktop 底层就是靠 WSL2 这个"水电工"来模拟 Linux 环境的**，用户不需要自己折腾 Linux。

### 2.2 Docker Engine vs Docker Desktop vs 镜像源（分清概念）

|            | Docker Engine                                 | Docker Desktop                        | 镜像源                                 |
| ---------- | --------------------------------------------- | ------------------------------------- | -------------------------------------- |
| 是啥       | **发动机**（真正干活的：拉镜像/跑容器） | **图形界面**（方便管理 Engine） | **加速服务器**（下载镜像的地址） |
| 有 GUI 吗  | 无（纯命令行）                                | 有                                    | 无                                     |
| 什么时候用 | Linux / 云服务器                              | Windows / Mac 日常                    | 配进 Engine，让拉镜像变快              |
| 类比       | 发动机                                        | 方向盘/仪表盘                         | 加油站                                 |

**关系：** Docker Engine 负责下载镜像，去哪个"加油站"（镜像源）可以配置。配置国内源 → 拉镜像飞快（默认 Docker Hub 在外国，慢）。

**我的现状：** 云服务器装了 Docker Engine ✅，本地 Windows 是 Docker Desktop

### 2.3 ⚠️ 误区：在 PowerShell 里敲 docker ≠ Docker 跑在 Windows 里

**docker 命令只是"遥控器"，干活的是"机器人本体"：**

| 角色                           | 是什么                                       | 装在哪                                          |
| ------------------------------ | -------------------------------------------- | ----------------------------------------------- |
| **docker CLI**（命令行） | 遥控器：只把命令**发送**出去           | PowerShell / WSL 终端（哪都能装）               |
| **Docker Engine**        | 机器人本体：真正拉镜像、跑容器的后台守护进程 | **必须跑在 Linux**（WSL2/Hyper-V 虚拟机） |

```
PowerShell 敲 docker compose up（部署 Dify 时）
      ↓ 遥控器发指令
Windows 里的 Linux 虚拟机（WSL2 或 Hyper-V 后端）
      ↓ 机器人本体干活
拉镜像 / 起容器 / 存数据 → 全存在虚拟机的虚拟磁盘里
```

**推论：**

- 卸载 Docker Desktop = 遥控器 + 藏着数据的虚拟机**一起删** → Dify 数据没了的真正原因
- 在哪个终端敲命令无关紧要，Engine 在哪跑才决定数据存哪
- 旧版（Hyper-V 后端）vs 新版（WSL2 后端）= 机器人换了房间，架构没变
- 验证后端：PowerShell 跑 `wsl -l -v`，有 `docker-desktop` 发行版 = WSL2 后端
- 延伸：设 `DOCKER_HOST` 环境变量，Windows 的遥控器可以隔空指挥**云服务器**上的 Engine

### 2.4 配置国内镜像源（加速拉镜像）

**Linux 服务器**（改文件）：

```bash
# 编辑 daemon 配置
sudo nano /etc/docker/daemon.json

# 写入
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.nju.edu.cn",
    "https://dockerproxy.com"
  ]
}

# 重启生效
sudo systemctl restart docker

# 验证
docker info | grep -A 5 "Registry Mirrors"
```

**Windows Docker Desktop**（GUI 方式，不用改文件）：

1. 打开 Docker Desktop → 右上角齿轮（Settings）
2. 左侧 **Docker Engine**
3. 在 json 里加 `registry-mirrors`（保留原有内容，别整个覆盖）
4. 点 **Apply & Restart**

**常用镜像源（失效就换一个）：**

- `https://docker.m.daocloud.io`（DaoCloud，比较稳）
- `https://docker.nju.edu.cn`（南大）
- `https://dockerproxy.com`
- `https://hub-mirror.c.163.com`（网易）

### 2.5 WSL 的网络模式（遇到的提示）

**提示：** `wsl: 检测到 localhost 代理配置，但未镜像到 WSL。NAT 模式下的 WSL 不支持 localhost 代理。`

**含义（人话）：**

- Windows 上设置了代理（如 Clash/VPN），但 WSL 默认跑在 **NAT 模式**下，和 Windows 是"两个独立网络空间"
- 相当于：Windows 是一楼（有门卫/代理），WSL 是二楼（NAT 模式有独立网络），二楼用不上一楼的门卫
- 所以 WSL 里的程序上网时**用不上 Windows 的代理**

**什么时候需要管：**

| 情况                                    | 影响                   |
| --------------------------------------- | ---------------------- |
| 不在 WSL 里访问外网（pip/GitHub）       | 没影响，忽略即可 ✅    |
| 需要 WSL 里 pip 装包 / git clone GitHub | 可能连不上或很慢       |
| 用的是国内源（阿里云、清华源）          | 没影响，国内源不用代理 |

**解决方案（如果确实需要）：**

1. **临时设置**：WSL 里 `export http_proxy=http://127.0.0.1:端口`（NAT 下可能要 Windows 局域网 IP）
2. **镜像网络（推荐一劳永逸）**：Windows 11 22H2+，在 `C:\Users\<用户名>\.wslconfig` 写：

   ```ini
   [wsl2]
   networkingMode=mirrored
   ```

   然后 `wsl --shutdown` 重启 WSL 生效，WSL 和 Windows 共用网络
3. **直接忽略**：不用外网时就无视这个提示

**我的情况：** 只在 WSL 里用 Docker，不在 WSL 访问外网 → 这个提示可以暂时忽略 ✅

### 2.6 WSL2 内存上限（.wslconfig 第二个用途：管住"吞内存怪兽"）

**背景：** 任务管理器里的 `vmmem` 进程 = WSL2 虚拟机本体，Docker 容器全跑在它肚子里。默认最多吃主机一半内存且不好好吐。`.wslconfig` 给它戴紧箍咒。

**我的配置**（`C:\Users\石晴\.wslconfig`）：

```ini
[wsl2]
memory=4GB                 # WSL2 最多吃 4GB（Docker 在里面）
swap=2GB                   # 内存不够时借硬盘当临时内存

[experimental]
autoMemoryReclaim=gradual  # 空闲内存逐步还给 Windows
```

- 4GB 是**天花板不是实耗**——平时跑一两个 nginx 只用几百 MB，别慌
- 主机 16GB → 4GB 合适；8GB → 可降到 3GB；**别低于 2GB**（Docker Desktop 自己要吃约 1GB）
- **生效方式**：改完必须 `wsl --shutdown` + 重启 Docker Desktop（配置只在虚拟机开机时读一次）
- **不用 Docker 时彻底释放内存**：托盘退出 Docker Desktop → PowerShell 跑 `wsl --shutdown` → vmmem 消失

### 2.7 实测：WSL 里的网络到底怎么走的？（2026-08-28）

> 疑问：WSL 不是"用不上 Windows 的 localhost 代理"吗？为什么 WSL 里 pull 很快、Google 还能打开？
> 猜测：① 开了 TUN 模式 ② Docker 镜像源生效——实测发现**两个都对，分工合作**。

**三招验证法（以后排查网络照着跑）：**

```bash
# 1. 查 Docker 配了哪些镜像源（有输出 = 镜像源配置生效）
docker info | grep -A 5 "Registry Mirrors"

# 2. 查当前出口 IP 在哪（显示国内 = 流量没走 VPN 直连）
curl cip.cc

# 3. 测被墙网站通不通（5 秒内通了 = TUN 在底层接管流量）
curl -I --max-time 5 https://www.google.com
```

**我的实测结果与判读：**

| 检查项           | 结果                               | 结论                             |
| ---------------- | ---------------------------------- | -------------------------------- |
| Registry Mirrors | daocloud / 南大 / dockerproxy 三个 | ✅ 镜像源配置生效                |
| cip.cc           | 湖南电信 106.16.x.x                | 国内流量直连（规则分流，非全局） |
| Google           | 5 秒内 HTTP 200                    | ✅ TUN 确实在抓 WSL 流量         |

**关键推理：** 湖南电信 IP 直连不可能打开 Google，但 WSL 里能打开 → WSL 流量 NAT 出去后被 Windows 的 TUN 虚拟网卡截走了。而 cip.cc 显示国内 IP → VPN 是**规则分流模式**（国内直连、国外走隧道），不是全局。

**TUN 模式 vs 系统代理（为什么 TUN 能管到 WSL）：**

|              | 系统代理（普通）                   | TUN 模式                                     |
| ------------ | ---------------------------------- | -------------------------------------------- |
| 工作层面     | 应用层：每个软件自己决定走不走代理 | 网络层：虚拟网卡在底层拦截**所有**流量 |
| 类比         | 员工自己把文件交给前台转发         | 大楼总网线上装关卡，进出都过                 |
| WSL 受影响吗 | ❌ WSL 不知道前台在哪              | ✅ WSL 流量 NAT 出去后也被截                 |

**我的网络组合拳全景图：**

```
WSL 里的流量
   │
   ├─ docker pull（拉镜像）
   │    └→ 优先问镜像源（daocloud/南大）→ 国内分仓直接拿货 ✅ 又快又稳
   │       （三个镜像源都挂了才回源 docker.io → 那时才走下面的隧道）
   │
   └─ 其他流量（curl / pip / git clone…）
        └→ NAT 出去 → Windows 的 TUN 虚拟网卡截住
             ├─ 国内网站 → 直连（cip.cc 显示湖南电信的原因）
             └─ 国外网站 → 代理隧道（Google 能通的原因）
```

**一句话总结：** 拉镜像快 = 镜像源的功劳；WSL 能翻出去 = TUN 的功劳。各管各的。

**延伸实验：** 把 VPN 切到"全局模式"再跑 `curl cip.cc`，IP 会变成 VPN 节点地区的 IP——这是区分"规则模式 vs 全局模式"最直观的办法。

**排查口诀：** 拉镜像慢先查镜像源（第 1 招），翻不出去先查 TUN/代理（第 2、3 招）。

---

## 第 3 章 镜像操作

### 3.1 镜像三连：pull / images / rmi

```bash
# 拉取镜像（从仓库下载）
docker pull <镜像名>

# 查看本地镜像
docker images

# 删除镜像（要先删掉使用它的容器）
docker rmi <镜像ID>
```

### 3.2 镜像的完整地址（pull 背后的"收货地址"）

**你以为写的是简写：**

```bash
docker pull nginx
```

**Docker 偷偷补全成完整地址：**

```bash
docker pull docker.io/library/nginx:latest
```

**逐段拆解（寄快递类比）：**

| 部分          | 名字                  | 意思                                               | 快递类比     |
| ------------- | --------------------- | -------------------------------------------------- | ------------ |
| `docker.io` | 仓库地址（Registry）  | 去**哪个**下载中心，官方是 Docker Hub        | 哪个快递网点 |
| `library`   | 命名空间（namespace） | 官方镜像专属"书架"；个人镜像这里是**用户名** | 哪个小区     |
| `nginx`     | 镜像名                | 光盘的名字                                         | 哪栋楼       |
| `:latest`   | 标签（tag）           | 版本号，`latest` = 最新版                        | 几零几室     |

**三处默认值（所以平时可以简写）：** 仓库默认 `docker.io`，官方镜像默认 `library` 书架，版本默认 `latest`。就像浏览器输 `baidu.com` 自动补全成 `https://www.baidu.com`。

**⚠️ 三个经典 typo 及对应报错（实战会频繁遇到）：**

| 写错                    | 正确        | 报错                                     | 规律                                     |
| ----------------------- | ----------- | ---------------------------------------- | ---------------------------------------- |
| `;ibrary`（标点错）   | `library` | `invalid reference format`（格式不对） | 地址格式错                               |
| `ngnix`（名字拼错）   | `nginx`   | `pull access denied / not found`       | **镜像名错 → 整个仓库找不到**     |
| `lastest`（版本拼错） | `latest`  | `manifest not found`                   | **tag 错 → 仓库在，但没这个版本** |

### 3.3 构建镜像：Dockerfile

Dockerfile 是"做镜像的菜谱"——用指令描述怎么一步步把镜像构建出来。

```dockerfile
# 基础镜像（用现成的 Python 3.10 环境）
FROM python:3.10

# 工作目录（容器里的默认路径）
WORKDIR /app

# 复制依赖文件到容器
COPY requirements.txt .

# 安装依赖
RUN pip install -r requirements.txt

# 复制代码到容器
COPY . .

# 启动命令（容器启动时执行）
CMD ["python", "app.py"]
```

**指令速查表（构建时 vs 启动时是分水岭）：**

| 指令           | 什么时候执行     | 作用                                                          |
| -------------- | ---------------- | ------------------------------------------------------------- |
| `FROM`       | 构建时           | 指定基础镜像（"地基"）                                        |
| `WORKDIR`    | 构建时           | 设定容器里的默认工作目录                                      |
| `COPY`       | 构建时           | 把宿主机文件复制进镜像                                        |
| `ADD`        | 构建时           | COPY 超集：能自动解压 tar、能拉 URL（日常用 COPY 就够）       |
| `RUN`        | 构建时           | 构建过程中执行命令（最常见：装依赖）                          |
| `ENV`        | 构建 + 运行      | 设置**持久**环境变量（构建时能读，容器跑起来还在）      |
| `ARG`        | 仅构建时         | 只在构建阶段有效的变量（`docker build --build-arg` 传入）   |
| `EXPOSE`     | 构建时           | **声明**容器监听的端口（纯文档性质，真正映射靠 `-p`） |
| `ENTRYPOINT` | **启动时** | 容器的"主命令"，不容易被覆盖                                  |
| `CMD`        | **启动时** | 默认命令，容易被`docker run` 后面的参数**覆盖**       |

**ENTRYPOINT vs CMD（易混点）：**

- `CMD` = 默认参数：`docker run <镜像> 别的命令` 会**整体覆盖**它
- `ENTRYPOINT` = 固定主程序：`docker run <镜像> 后面的东西` 变成传给它的**参数**而不是替换它
- 常见搭配：`ENTRYPOINT` 定程序（如 nginx），`CMD` 定默认参数——两者会被拼在一起执行

**.dockerignore（类比 .gitignore）：** 构建前排除不想 COPY 进镜像的文件——`node_modules/`、`.git/`、临时文件、密钥。既缩小镜像体积，也避免把敏感信息打进镜像。

**分层缓存（为什么模板里"先 COPY requirements.txt 装依赖，再 COPY 代码"）：**

```
Docker 每条指令生成一层，缓存机制：改了第 N 层，第 N 层之后全部重建，之前的直接复用
    ↓
先 COPY requirements.txt + pip install   ← 依赖不变就永远走缓存（重建项目时秒过）
再 COPY . .                              ← 代码天天改，只重建这一层（秒级）
    ↓
反例：开头就 COPY . . → 改一行代码 → 依赖重装一遍 → 构建几分钟起步
```

**构建 + 运行命令：**

```bash
docker build -t <镜像名>:<tag> .
#    ↑ 起名（可带版本号，不写默认 latest） ↑ 结尾的 . 是"构建上下文"=当前目录，千万别漏
docker run hello-docker          # 注意：run 只自动 pull，不自动 build
```

**推送镜像到 Docker Hub（让全世界都能 pull 你的镜像）——✅ 2026-09-13 实操通过：**

```bash
docker login                              # 第 1 步：登录（提示输用户名密码 / 浏览器授权）
docker tag hello-docker guanqishi/hello-docker   # 第 2 步：给已有镜像贴"带用户名的第二块名牌"
docker push guanqishi/hello-docker        # 第 3 步：推送（分层上传，Hub 里已有的层秒传）
docker run guanqishi/hello-docker         # 验证：任何人一条命令就能跑
```

> 我用的账号：`guanqishi`（显示名 Modusensus）。镜像地址：https://hub.docker.com/r/guanqishi/hello-docker

**三个实操细节：**

- `docker tag` 不是复制镜像，只是给**同一个镜像**多贴一块名牌（`docker images` 里两个名字同一个 IMAGE ID）——零额外空间
- push 结尾的 `digest: sha256:debdee...` 和本地 build 输出里的 `exporting manifest list sha256:debdee...` **一致**——digest 是镜像内容指纹，证明本地造的和推上去的同一个字节不差
- push 那十行 `Pushed` 是**分层上传**：Hub 上早就有的层（如 alpine 地基）秒传，只有你的独有层真上传——分层存储在服务端同样生效

**镜像名必须带用户名前缀**（`用户名/镜像名`），否则 push 不知道往谁家仓库推。

> ✅ 2026-08-29 网课看完，已整理填充。

### 3.4 依赖管理：requirements.txt 与 pip（2026-09-13 实操补记）

**pip = Python 的快递采购员**

Python 世界有个超大商场叫 **PyPI**（Python Package Index），几十万个现成包摆在里面。pip 就是帮你采购的快递员：

```powershell
pip install requests     # "快递员，帮我买 requests 送到我家"
pip list                 # "看看我家里都有哪些包"
pip uninstall requests   # "这个不要了，退回去"
```

如果你会 npm/pnpm，这套你已经会了：

| | Node.js 世界 | Python 世界 |
| --- | --- | --- |
| 商场 | npm 仓库 | PyPI |
| 采购命令 | `npm install` | `pip install` |
| 购物清单 | `package.json` | `requirements.txt` |
| 查已装包 | `npm list` | `pip list` |

**requirements.txt = 购物清单（写给别的电脑看的便签）**

没有任何魔法，就是个普通文本文件。解决的问题：你的代码 `import requests`，但别的电脑上没装 → 报 `No module named 'requests'`。于是把要装的东西写进文件、跟代码放一起，对方照着装一个不漏。

```text
# 这是注释，写给人看的
requests            # 最简：只写名字，pip 装最新版
requests==2.31.0    # 精确版本：生产环境用（防止新版本改了 API 半夜崩）
requests>=2.31.0    # 底线版本：至少这么新
```

**Dockerfile 里的 `-r` 就是"照单念"：**

```dockerfile
RUN pip install -r requirements.txt
#     ↑     ↑   ↑  ↑              ↑
# 构建时  采购  read  照这张清单    清单文件名
```

**关键领悟：清单和流程是分离的。** 加一个包只改 requirements.txt，Dockerfile 一个字不用动（重新 build 就跑一遍流程）；清单变，流程不变。反例是"当场点名"野路子：`RUN pip install requests` 写死在 Dockerfile——每加一个包就改 Dockerfile，越改越长。

**标准库 vs 第三方包（买房自带家具 vs 商场采购）：**

| 类型 | 类比 | 例子 | 要 pip install 吗 |
| --- | --- | --- | --- |
| 标准库 | 买房自带的家具 | `time`、`datetime`、`os`、`json` | 不用，Python 自带 |
| 第三方包 | 得去商场买的家具 | `requests`、`pandas`、`numpy` | 要，写进清单 |

判断法：从没装过却能直接 `import` → 标准库；当年跟着教程 `pip install` 过的 → 第三方包。

**pip freeze 的坑（专业姿势但要小心）：**

```powershell
pip freeze > requirements.txt   # 把当前环境所有包连版本号全倒进清单
```

它分不清"项目真需要的"和"顺手装过的"，会把八竿子打不着的包也写进去。适合"打包现成的虚拟环境"，手写适合"从零明确依赖"。

**requests = 让 Python 伸向互联网的手**

`requests.get("https://api.github.com")` 就是让代码像浏览器一样发 **HTTP 请求**（"喂，这个网址，把内容发给我"）。它等于 n8n 里那个 **HTTP Request 节点**的代码版。毕设要拿数据分析城市湿地公园，数据很多来自开放 API——第一步往往就是它。

---

## 第 4 章 容器操作

### 4.1 生命周期命令

```bash
# 运行容器（本地没有镜像会自动 pull；run = pull + create + start 三合一）
docker run <镜像名>

# 查看正在运行的容器
docker ps

# 查看所有容器（包括已停止）
docker ps -a

# 停止容器
docker stop <容器ID>

# 删除容器（要先停止）
docker rm <容器ID>

# 只创建不启动（run = create + start，拆开来用就是这两条）
docker create <镜像名>
docker start <容器ID>

# 一键清理所有已退出/停止的容器
docker container prune

# 重启容器（正在跑的、已停的都能用；常用于改了配置后让容器重新加载）
docker restart <容器名或ID>
```

### 4.2 容器名 vs 镜像名（stop/rm 只认左边和右边）

```bash
# docker ps -a 表格的对应关系：
# CONTAINER ID   IMAGE    ...   NAMES
#    第一列      镜像名          最后一列（容器名）
```

- `docker stop` / `docker rm` / `docker restart` / `docker logs` 后面填的**都是容器名或容器 ID**（第一列 / 最后一列）
- `docker rmi` / `docker run` 后面填的**才是镜像名**（IMAGE 列）
- 没用 `--name` 起名时，容器名是随机生成的（如 `happy_yonath`）
- 注意：容器 ID 不用输全，前几位就行（如 `docker stop 3a2f`）

### 4.3 docker run 参数全解

```bash
# 后台运行 + 命名 + 端口映射 + 挂载目录
docker run -d --name <容器名> -p 宿主机端口:容器端口 -v 宿主机路径:容器路径 <镜像名>
```

| 参数       | 作用                                     | 例子                               |
| ---------- | ---------------------------------------- | ---------------------------------- |
| `-d`     | 后台运行（detach），不占用终端           |                                    |
| `--name` | 给容器起名字                             | `--name myapp`                   |
| `-p`     | **端口映射**：把容器端口暴露给外面 | `-p 8080:80`（外部8080→容器80） |
| `-v`     | **挂载目录**：把本机文件夹塞进容器 | `-v /host/data:/container/data`  |

> **⚠️ 挂载目录 -v 的正确写法**：必须是 `宿主机路径:容器路径` 两边都要写，中间用**冒号**分隔。
> ❌ `-v /host/data`（只写一边，不对）
> ✅ `-v /home/user/data:/app/data`（宿主机路径:容器路径）

**网课回忆成果（2026-08-29）：**

| 参数                         | 作用                           | 说明 / 例子                                       |
| ---------------------------- | ------------------------------ | ------------------------------------------------- |
| `-e`                       | 往容器里**传环境变量**   | `-e MONGO_INITDB_ROOT_USERNAME=admin`           |
| `--name`                   | 给容器起名                     | 容器名**不能重复**，撞名直接报错            |
| `-it`                      | 交互模式：把控制台"伸进"容器里 | 和`--rm` 连用是临时调试神器                     |
| `--rm`                     | 容器**一停止就自动删除** | `docker run -it --rm <镜像>` 用完即走，不留垃圾 |
| `--restart always`         | 容器一停就自动拉起             | 内部崩溃、宿主机断电重启，全都给你拉起来          |
| `--restart unless-stopped` | 同上，但手动 stop 的不拉起     | 我亲手停的就让它装死，其他情况照常复活            |

**`--restart always` vs `unless-stopped` 一句话：** `always` 死都要活；`unless-stopped` 我亲手按停的它就乖乖装死。

**`-e` 的环境变量名去哪查？** 去 **Docker Hub 的镜像页面**或 **GitHub 仓库 README**——比如 MongoDB 的账号密码就靠 `-e` 传进去，避免写死在配置文件里。

### 4.4 docker run 的语法铁律：选项必须在镜像名**前面**

```bash
docker run [一堆选项] <镜像名> [传给容器内部的命令]
#          ↑ 选项全在镜像名左边        ↑ 镜像名右边的东西不再被当选项
```

- 镜像名是"分水岭"：它**右边**的一切都会原样传给容器内部，Docker 不再解析为选项
- ❌ `docker run nginx -d` → `-d` 被当成传给容器内 nginx 的参数（等于没写）
- ✅ `docker run -d nginx`
- `--name` 是**两个**横杠；只写 `name` 会被当成普通字符串

### 4.5 重启的两层含义（别搞混！）

"重启 Docker"其实有两层，命令完全不同：

| 层级                       | 是什么                     | 命令                        | 什么时候用                       |
| -------------------------- | -------------------------- | --------------------------- | -------------------------------- |
| **重启容器**         | 重启某一台"虚拟电脑"       | `docker restart <容器名>` | 改了配置、容器抽风，最常用       |
| **重启 Docker 引擎** | 重启整个"发动机"（Engine） | 见下表                      | 改了 daemon.json、引擎本身出问题 |

**重启 Docker 引擎的命令（按系统分）：**

```bash
# Linux 云服务器（现代 systemd 方式，推荐）
sudo systemctl restart docker

# Linux 老方式（SysV，效果一样，老系统用）
service docker restart

# Windows Docker Desktop（没有命令行方式，两种做法）
#   1. 托盘图标右键 → Restart
#   2. WSL 里执行 wsl --shutdown（粗暴但有效，会关掉所有 WSL 实例）
```

> 我的现状：本地是 Docker Desktop（Windows），引擎重启走托盘 GUI；云服务器是 Docker Engine，用 `sudo systemctl restart docker`。
> 注意：WSL 里能不能用 `systemctl` 取决于是否开启了 systemd（`/etc/wsl.conf` 里 `[boot] systemd=true`）。

### 4.6 日志与调试

```bash
# 查看容器日志（-f = follow 实时滚动；不加只看已有日志）
docker logs -f <容器ID>
# 注意：logs -f 里按 Ctrl+C 只是退出"看日志"，容器不受影响
#（前台模式里 Ctrl+C 则是停容器——同一个按键两种命运）

# 查看容器里正在跑的进程（ps -ef 是 Linux 命令，在容器里执行）
docker exec <容器ID> ps -ef

# 进入容器内部，打开一个交互式 shell
docker exec -it <容器名或ID> bash
# -i = interactive 交互式；-t = tty 分配终端；退出输入 exit
# bash 打不开（极简镜像没装 bash）→ 换保底写法 /bin/sh
# 容器是"极简系统"，很多工具没预装：apt update && apt install <软件> 现场装

# 体检报告：查容器/镜像的一切配置（挂载、端口、网络、环境变量……）
docker inspect <容器名>
# 查挂载看输出里的 "Mounts" 段：Source=宿主机路径，Destination=容器路径
# 忘了容器当时用什么参数启动的？inspect 全记得——它就是容器的"档案袋"
```

**读 `docker ps -a` 的 STATUS 列：**

| 状态             | 含义                   | 下一步                 |
| ---------------- | ---------------------- | ---------------------- |
| `Up x minutes` | 正在运行               | 直接用                 |
| `Exited (0)`   | 正常退出（0 = 没报错） | 不用 stop，直接`rm`  |
| `Exited (非0)` | 异常退出（有错误发生） | `docker logs` 查死因 |
| `Restarting`   | 反复崩溃重启中         | `docker logs` 查死因 |

**三个"体检"命令：top / stats / diff（都只读观察，不动容器一根汗毛）**

```bash
# 看容器里正在跑的进程（站在容器外面看，不用 exec 钻进去）
docker top <容器名或ID>
# 和 docker exec <容器> ps -ef 结果类似，但优点：容器里哪怕没装 ps 命令也能看
# 类比：exec ps -ef 是"开门进屋数人头"，docker top 是"隔着玻璃数人头"

# 实时监控所有容器的资源占用（CPU / 内存 / 网络读写 / 磁盘读写）
docker stats
# 像 Linux 的 top：默认几秒刷新一次，Ctrl+C 只是退出"看"，容器不受影响
# 只盯一个容器：docker stats <容器名>      只看一眼不滚动：加 --no-stream
# 默认只显示"运行中"的容器（停了的没人监护，很合理）

# 查看容器相对于镜像，文件系统被改过哪些地方
docker diff <容器名或ID>
# 输出每行 = 一个字母 + 文件路径，只有三种字母：
#   A = Added   新增的文件
#   C = Changed 修改过的文件
#   D = Deleted 删除的文件
```

**调试体检四件套（top / stats / diff / inspect）：**

| 命令               | 回答的问题                 | 类比                     |
| ------------------ | -------------------------- | ------------------------ |
| `docker top`     | 容器里都有谁（进程）在跑？ | 隔着玻璃数人头           |
| `docker stats`   | 容器吃掉多少 CPU / 内存？  | 心电监护仪（实时跳动）   |
| `docker diff`    | 容器里动过哪些文件？       | 搬家前后对比照           |
| `docker inspect` | 当初用什么参数启动的？     | 档案袋（静态配置全记录） |

**diff 顺出的大重点（通往第 5 章数据卷）：**

- 镜像是**只读的**（第 1 章说过：母盘）；容器一启动，Docker 在上面盖一层**可写层**--想象一张描图纸
- 你在容器里增/删/改的所有文件，全写在这层描图纸上，`docker diff` 看到的就是它
- `docker rm` 删容器 = 连描图纸一起扔掉，改动**灰飞烟灭**
- 结论：容器天生"什么都记不住"，重要数据必须挂卷（这正是第 5 章存在的意义）

---

## 第 5 章 数据卷（挂载）

### 5.1 三种挂载方式对照（绑定 / 命名 / 匿名）

| 类型     | 写法                         | 左边是什么 | 数据存哪                                        |
| -------- | ---------------------------- | ---------- | ----------------------------------------------- |
| 绑定挂载 | `-v /宿主机路径:/容器路径` | 真实路径   | 我指定的文件夹（自己管）                        |
| 命名卷   | `-v 卷名:/容器路径`        | 一个名字   | Docker 统一保管（`/var/lib/docker/volumes/`） |
| 匿名卷   | `-v /容器路径`（只写右边） | 没有左边   | Docker 随机起名保管（难管理，不推荐）           |

> 术语备忘：命名卷 = 具名卷 = named volume，同一个东西（翻译差异）
>
> 分工直觉：**绑定挂载管"我想放哪"，命名卷管"Docker 帮我保管"**

### 5.2 挂载后"谁说了算"？空文件 / 不存在的路径会怎样

**绑定挂载（-v 宿主机路径:容器路径）= 用海报盖住墙上的画：**

| 宿主机文件状态  | 容器里看到什么                                         | 容器原内容丢了吗 |
| --------------- | ------------------------------------------------------ | ---------------- |
| 有内容          | 宿主机的版本                                           | 没丢，被盖住     |
| 空文件          | 空（nginx 白屏/403）                                   | 没丢，被盖住     |
| ⚠️ 路径不存在 | Docker**不报错**，自动创建**空目录**挂上去 | 没丢，被盖住     |

- 宿主机内容**盖住**容器路径；原内容还在镜像图层里躺着，取消挂载就回来
- **经典陷阱**：宿主机路径拼错 → Docker 悄悄建空目录 → 容器内容"神秘消失"。挂载后内容变空，先查宿主机路径

**命名卷（-v 卷名:容器路径，左边是名字不是路径）性格相反——"首次拷贝"：**

- 卷是新建的空卷 → Docker **先把容器里该路径的现有内容拷进卷**，再挂载
- 这就是 `-v n8n_data:/home/node/.n8n` 能保住 n8n 初始配置的原因

### 5.3 volume 命令家族（和 rm / ls 家族一脉相承）

```bash
docker volume create <卷名>    # 创建命名卷
docker volume ls               # 列出所有卷
docker volume inspect <卷名>   # 看详情：真实存放路径、被谁挂载
docker volume rm <卷名>        # 删除指定卷
docker volume prune            # 清理"没人用"的卷（悬空卷）
docker volume prune -a         # 狠招：删除所有没有任何容器使用的卷（连命名卷也清，数据无价，想清楚再按）
```

- `inspect` 是通用"体检报告"命令：`docker inspect <容器/镜像>` 都能用，查配置第一反应
- Docker CLI 是 Unix 命令风格的变体：`rm`（容器）/ `rmi`（镜像，i=image）/ `ls` / `prune` 全家规律一致

### 5.4 -v 实战：换掉 nginx 默认首页

`-v` 是 Docker Engine 的功能，Windows/Mac/裸 Linux 行为一致；方向规则不变：**左宿主机 B，右容器 A**

```bash
# 单文件版：用宿主机的 B.html 盖住容器里的默认首页
docker run -d --name my-web -p 8080:80 \
  -v /root/B.html:/usr/share/nginx/html/index.html \
  nginx

# 更推荐：整个目录挂载（改宿主机文件 = 网页立刻变，不用重启容器）
docker run -d --name my-web -p 8080:80 \
  -v /root/mysite:/usr/share/nginx/html \
  nginx
```

- 右边必须写**容器内部的真实路径**（nginx 默认首页在 `/usr/share/nginx/html/`）
- 查容器内路径三招：翻镜像官方文档 / `docker exec -it` 进容器 `ls` / `docker inspect`
- **挂载后两边是同一个文件**：宿主机改文件 → 容器里立刻生效 → 开发时挂代码目录比 COPY 进镜像方便

---

## 第 6 章 容器网络

### 6.1 -p 8080:80 的冒号（为什么必须写两个端口）

**根源：容器网络是隔离的 → 宿主机和容器各有一套门牌号（端口）**，冒号就是"转接规则"：

```bash
-p 8080:80   # 读作：寄到宿主机 8080 的包裹，转交给容器里的 80
```

| 部分    | 是谁的端口 | 谁说了算                        | 类比（酒店电话） |
| ------- | ---------- | ------------------------------- | ---------------- |
| 左 8080 | 宿主机     | 我随便挑（没被占用就行）        | 前台总机号码     |
| 右 80   | 容器       | nginx 定死的（它出生就监听 80） | 房间分机号       |

- 冒号 = "从 A 转到 B"的箭头，两边缺一不可
- 只写一个数字（如 `-p 8080`）：Docker 把它当成**容器端口**，宿主机端口随机分配——而容器里 8080 没人监听，转过去没人接电话 ❌
- 验证：`-p 8888:80` 一样能访问 → 前台号码随便换，分机 80 是 nginx 定死的

### 6.2 宿主机端口能随便写吗？（能，但有三个规矩）

**规矩 1 —— 范围 0~65535：** 一台机器共 65536 个门牌号

**规矩 2 —— 避开 0~1023（特权端口）：** 被历史著名的"老前辈"占了名分：80（HTTP）、443（HTTPS）、22（SSH）、3306（MySQL）……系统和老软件默认来抢，新手选 **1024 以上**（8080 / 8888 / 1234 都很安全）

**规矩 3 —— 别撞车：** 一个门牌同时只能住一户；端口被占会报 `port is already allocated`，换一个就行

> 80/443 理论上也能绑（Docker Engine 在 Linux 里有 root 权限），但没必要，平民端口够用

**⚠️ 左右两边的自由度完全不同：**

|            | 左边（宿主机端口）              | 右边（容器端口）                  |
| ---------- | ------------------------------- | --------------------------------- |
| 能随便写吗 | ✅ 基本随便（1024+ 没被占即可） | ❌ 必须是服务实际监听的端口       |
| 原因       | 前台总机号码随我定              | nginx 出生就守在 80，写别的没人接 |

**实战：** `-p 1234:80 nginx` → 浏览器访问 `http://localhost:1234` ✅

### 6.3 为什么 localhost 访问不用"开安全组"？

三种"谁能访问我"的关卡（由近到远）：

| 谁访问谁                     | 走哪条路           | 要过什么关卡                                               |
| ---------------------------- | ------------------ | ---------------------------------------------------------- |
| 自己访问自己（localhost）    | 回环接口，不出网卡 | **不过任何关卡，直接通** ✅                          |
| 局域网设备（手机访问我电脑） | 从"家门"进来       | 本机防火墙（Windows Defender / Linux 的 ufw）              |
| 外网访问云服务器             | 进"机房大楼"       | **云安全组**（大楼保安）+ 机器自身防火墙（家里门锁） |

- `localhost` / `127.0.0.1` = 回环地址：数据包在电脑内部转一圈就回来，根本不出网卡 → 防火墙和安全组都管不着，本地练 Docker 不用配任何入站规则
- 安全组在机器**外面**（云厂商设的），本机防火墙在机器**里面**，两道关都可能拦人；想让手机访问电脑服务时，才需要放行本机防火墙入站规则
- 我的环境：Docker Desktop（WSL2）自动把容器端口搭桥到 Windows 的 localhost，所以 `http://localhost:8080` 开箱即通

### 6.4 容器之间怎么通信？🔲（网课已学，待回忆填充）

**已确认的事实（实战得来）：**

- 容器网络和宿主机隔离 → 所以外界访问容器内服务必须 `-p` 端口映射
- 同一个 docker compose 项目里，容器之间可以**直接用服务名当域名互访**（如 API 容器连数据库写 `db:5432`）——compose 自动建了网络 + 自动配了"按名字拨号的内线"

**三种网络模式（网课回忆整理 2026-08-29）：**

| 模式               | 特点                                                                                                 | 类比                       |
| ------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------- |
| `bridge`（默认） | Docker 建虚拟网桥，每个容器一块虚拟网卡、分到独立内网 IP，出网靠 NAT                                 | 大楼公共走廊，每间房有门牌 |
| `host`           | 容器**直接共用宿主机的网络栈**：没有独立 IP，监听的端口就是宿主机端口（不需要也不能用 `-p`） | 直接住进大楼前台           |
| `none`           | 不配任何网络，完全断网                                                                               | 关小黑屋                   |

**docker network 命令家族（和 volume 家族一个套路）：**

```bash
docker network ls                        # 列出所有网络
docker network create <网络名>           # 创建自定义 bridge 网络（可指定子网）
docker network inspect <网络名>          # 体检：看谁在里面、子网是多少
docker network rm <网络名>               # 删除网络
docker network connect <网络名> <容器>   # 把运行中的容器"拉进群聊"
docker network disconnect <网络名> <容器> # 退群
```

**自定义 bridge vs 默认 bridge（为什么服务名互访需要自定义网络）：**

|              | 默认 bridge（docker0） | 自定义 bridge                    |
| ------------ | ---------------------- | -------------------------------- |
| 容器互访     | 只能靠 IP 地址         | **容器名就是域名**，直接拨 |
| DNS 自动解析 | ❌ 没有                | ✅ 自动配好                      |
| 隔离性       | 所有容器挤一个大群     | 一个项目一个群，互不干扰         |

- compose 的"内线电话"（服务名互访）就是靠自动创建的自定义 bridge 网络实现的
- `--link` 是老古董：compose 普及之前容器互联的老办法，官方已不推荐，知道有这个东西就行

---

## 第 7 章 Docker Compose（舰队模式）

### 7.1 为什么需要 compose：Dify 的教训

- Dify 这类应用不是**一个**镜像，而是几十个容器组成的舰队（API + Worker + 数据库 + Redis + nginx……）
- 一个个 `docker run` 敲到手软还容易错 → **compose 用一个 yaml 文件把整支舰队写成"花名册"，一条命令全员拉起**
- 踩过的坑：`docker run dify` 报错——dify 根本不是镜像名，它是"一个文件夹 + 一个 docker-compose.yaml"组成的应用

### 7.2 核心命令（在 docker-compose.yaml 所在目录执行）

```bash
docker compose up -d      # 照着 yaml 拉起整支舰队（-d 后台）
docker compose ps         # 只看这支舰队的成员（比 docker ps 干净）
docker compose logs       # 舰队日志（可加 -f 跟踪）
docker compose down       # 收摊：停止并删除舰队容器（数据卷默认保留）
```

**Dify 部署标准套路：**

```bash
cd D:\dify-main\docker     # 进到 yaml 所在目录
cp .env.example .env       # 首次部署先复制配置
docker compose up -d       # 拉起
docker compose ps          # 全部 Up 才算成功
```

- 改端口：编辑 `.env` 的 `EXPOSE_NGINX_PORT=1234` → 再跑一次 `up -d`
- **数据备份**：Dify 的 yaml 自带挂载，数据都在 `dify/docker/volumes`（"冰箱"出厂自带）→ 重装前备份这个文件夹就能保住数据

### 7.3 compose 的三个特性

**1. 点名册（自动命名）：**

- yaml 里每个服务（service）一行：用什么镜像、什么端口、挂什么卷全写在册
- 容器自动命名：`项目名-服务名-序号`（如 `docker-nginx-1`），不用 `--name`，一眼看出谁是谁

**2. 内线电话（服务名互访）：**

- 同一 compose 网络里，容器之间直接用**服务名**当域名互访（`db:5432`）
- compose 自动建网络 + 自动配 DNS，等于每个房间装了"按名字拨号的内线"

**3. 增量重建（聪明地更新）：**

- 改了配置再跑 `up -d`，compose 只重建受影响的容器，其他不动
- 不用推倒重来

### 7.4 单兵 vs 舰队：怎么判断新应用怎么部署

| 应用    | 部署方式                | 为什么                                    |
| ------- | ----------------------- | ----------------------------------------- |
| n8n     | 🎉 单容器（docker run） | 自带 SQLite 数据库，一个人就是一支队伍    |
| Dify    | 舰队（docker compose）  | API + Worker + 数据库 + Redis + nginx…… |
| RAGFlow | 舰队（docker compose）  | 检索引擎 + MySQL + MinIO + Redis……      |

**两个快速判断信号：**

1. 翻应用的仓库/文件夹：有 `docker-compose.yaml` → 舰队；文档只给一条 `docker run` → 单兵
2. 文档提到数据库、Redis、消息队列……八成是舰队

> 原理一句话：**应用依赖的"服务"越多，越需要 compose 把它们编成队。** 单体应用自带一切 → 单容器；分布式应用各零件各跑各的容器 → compose 统一指挥。

**yaml 怎么写？拿 MongoDB 做对比：一条 run 命令 vs 一份 yaml 花名册**

以前单兵作战（一长串参数，敲错一个字全重来）：

```bash
docker run -d --name mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  mongo
```

写成 compose 花名册（`docker-compose.yaml`，参数一目了然、可进版本管理）：

```yaml
services:                     # 花名册开头：下面每个条目是一个服务
  mongo:                      # 服务名（也是它在网络里的"域名"）
    image: mongo              # 用哪个镜像（= run 最后面的镜像名）
    container_name: mongo     # 可选手动起名（不写就自动 项目名-服务名-序号）
    environment:              # = -e 传环境变量
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret
    ports:                    # = -p 端口映射（注意有引号和短横线）
      - "27017:27017"
    volumes:                  # = -v 挂载
      - mongo_data:/data/db
    restart: always           # = --restart always

volumes:                      # 顶层 volumes 段：声明命名卷（compose 统一管理）
  mongo_data:
```

**run 参数 → yaml 字段对照表：**

| docker run 参数      | yaml 写法                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `<镜像名>`         | `image:`                                                                                     |
| `-e KEY=VAL`       | `environment:`                                                                               |
| `-p 宿:容`         | `ports:`                                                                                     |
| `-v 卷:路径`       | `volumes:`（卷在顶层声明）                                                                   |
| `--restart always` | `restart: always`                                                                            |
| `--name`           | `container_name:`                                                                            |
| （本地构建）         | `build: .`（用 Dockerfile 现场做，和 `image:` 二选一：image 直接拉现成的，build 本地构建） |

**compose 的网络与启动顺序：**

- 每个 compose 项目自动创建一个专属 bridge 网络（名字类似 `项目名_default`）——所以同项目服务名互访开箱即用
- `depends_on:` 声明启动顺序依赖：数据库没起来，应用先起也白起 → 写明"先等它"

```yaml
services:
  web:                # 应用服务（依赖数据库）
    depends_on:
      - mongo         # 意思：先拉起 mongo，再拉起 web
```

**up / stop / start / down 家族（谁动谁不动）：**

| 命令                     | 容器                 | 网络 | 数据卷 |
| ------------------------ | -------------------- | ---- | ------ |
| `docker compose up -d` | 创建并启动           | 创建 | 保留   |
| `docker compose stop`  | 只停止               | 保留 | 保留   |
| `docker compose start` | 启动已停的           | 保留 | 保留   |
| `docker compose down`  | 停止**并删除** | 删除 | 保留   |

**-f 指定文件名（yaml 不叫"标准名"时的指路牌）：**

```bash
# compose 默认只认 docker-compose.yaml / compose.yaml
# 文件名是别的（如 mongo-compose.yaml）就要 -f 指路，不然找不到直接报错
docker compose -f mongo-compose.yaml up -d
```

> ✅ 2026-08-29 网课看完，已整理填充。

---

## 第 8 章 实战项目

- [X] 项目一：用 Docker 跑起 nginx（2026-08-29）✅
- [X] 项目二：海报盖画——挂载换掉 nginx 默认首页（2026-09-13）✅
- [X] 项目三：第一个自制镜像 hello-docker（2026-09-13）✅

### 项目一：跑起 nginx 网页服务器 ✅

**核心命令（背这个模板就行）：**

```bash
docker run -d --name my-nginx -p 8080:80 nginx
```

**逐段拆解（从左到右读）：**

```bash
docker run         # 创建并启动一个容器
  -d               # 后台运行（detach）：不占终端，只回一行容器 ID
  --name my-nginx  # 给容器起名字（不起名会随机生成 happy_yonath 这种，又长又难记）
  -p 8080:80       # 端口映射：宿主机 8080 → 容器 80（口诀：左边是"我"，右边是"容器"）
  nginx            # 用哪个镜像跑（不写 tag 默认 latest）
```

**验证它活着：**

```bash
docker ps   # 应该看到 my-nginx，状态 Up
# 浏览器访问 http://localhost:8080 → 看到 nginx 欢迎页
```

**用完收尾（完整生命周期）：**

```bash
docker stop my-nginx   # 停止（填容器名，不是镜像名！参见踩坑记录）
docker rm my-nginx     # 删除
```

**一句话记忆：** `-d` 后台、`--name` 起名、`-p 左:右` 端口、最后是镜像。

### 项目二：海报盖画——挂载换掉 nginx 首页 ✅

> 2026-09-13 完成（顺便第一次接触 HTML，踩了中文乱码坑，已解决并记录）。

**核心比喻：** nginx 镜像自带一张"画"（欢迎页），`-v` 挂载把你的文件夹当"海报"盖上去——海报遮住画。撕掉海报（删容器不挂载），画原样还在：**画从没被删，只是被盖住**。

**步骤：**

```powershell
# 1. 建文件夹 + 写"海报"（⚠️ 中文内容别用 PowerShell > 重定向写，见编码坑）
mkdir D:\mysite
# 用编辑器（VSCode/Trae）创建 D:\mysite\index.html，保存为 UTF-8，内容带 meta charset

# 2. 挂载运行（左边是我电脑的路径，右边是容器内 nginx 首页路径）
#    一条命令同时干三件事：造容器 + 启动 nginx + 盖海报（不用先手动启动 nginx！）
docker run -d --name my-web -p 8081:80 -v D:/mysite:/usr/share/nginx/html nginx
```

3. 浏览器开 `http://localhost:8081` → 看到自己的 B 页面（不是 nginx 欢迎页）
4. 改 `index.html` 文字 → 保存 → **刷新浏览器就变**（不用碰容器——验证"两边是同一个文件"）
5. ✅ 撕海报验证（2026-09-13 实测通过）：`stop` + `rm` my-web 后裸跑 `docker run -d --name bare-nginx -p 8082:80 nginx` → 8082 页面欢迎页原样还在——**画没被删，只是被盖住；数据写在挂载里，不是容器里**

**HTML 最小骨架（够用版）：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">   <!-- 必须！告诉浏览器"我用 UTF-8 密码本" -->
  <title>我的 B 页面</title>
</head>
<body>
  <h1>我的 B 页面：海报盖画成功！</h1>
</body>
</html>
```

**编码坑（详见第 9 章）：** 文件实际是 UTF-8，但 HTML 没写 `<meta charset>` → 中文 Windows 浏览器默认按 GBK 猜 → 乱码成"鎴戠殑"。加一行声明即可；写中文文件优先用编辑器（UTF-8），别用 PowerShell `>` 重定向（PowerShell 5 默认写 UTF-16）。

### 项目三：第一个自制镜像 hello-docker ✅

> 2026-09-13 完成。第一次 build 失败（站错目录），修正后一次通过。

**最终三个文件（在 `environment/docker-hello/`）：**

`app.py`——用到第三方包 requests 当"验货员"（能打印版本号 = pip 采购真到货了）：

```python
import time       # 标准库：买房自带的家具，不用采购
import requests   # 第三方包：清单里采购的，打印版本号 = 开箱验货

now = time.ctime()  # 拿到"现在时间"（一个字符串）

print("Hello, Docker!", now)                   # 问候语 + 时间
print("requests 版本：", requests.__version__) # 能打印 = pip 真的到货了
```

`requirements.txt`——购物清单（和代码里的 import 一一对应）：

```
# 第三方依赖清单：Dockerfile 里的 pip install -r 会照单采购
requests
```

`Dockerfile`——标准版：依赖在前（缓存命中率高），代码在后（天天改只重跑一层）：

```dockerfile
FROM python:3.11-alpine

WORKDIR /app

# 依赖层在前：requirements.txt 很少改，这层缓存一直命中，pip 不会重复装
COPY requirements.txt .
RUN pip install -r requirements.txt

# 代码层在后：app.py 天天改，也只重跑这一层
COPY app.py .

CMD ["python", "app.py"]
```

**构建 + 运行（必须先 cd 进 docker-hello 目录，`.` 才指对地方）：**

```bash
docker build -t hello-docker .
docker run hello-docker          # 成功输出：Hello, Docker! <时间> + requests 版本
docker ps -a                     # 状态 Exited (0) = 打印完善终（0 是正常退场）
```

**分层缓存现场验证（连跑两次 build）：**

```bash
docker build -t hello-docker .   # 第一次：pip 层 14.7s 真下载
docker build -t hello-docker .   # 第二次：全程 CACHED，2.3s 结束——分层缓存眼见为实
```

**观察题答案：** 容器里的 Python 哪来的？——`FROM` 的地基镜像自带（python:3.11-alpine），宿主机 conda 的 Python 全程没参与。这就是"环境跟着镜像走"。

**延伸思考（和毕设的关系）：** 将来给数据分析项目写 Dockerfile，就是把 `requests` 换成 `pandas` + `numpy`，加进 requirements.txt 而已——流程一模一样。

**最终章：镜像已推送 Docker Hub**（2026-09-13）——`guanqishi/hello-docker`，任何人 `docker run guanqishi/hello-docker` 即可运行。完整交付链：写代码 → Dockerfile → build → tag → push → 从 Hub 拉取运行 ✅

---

## 第 9 章 踩坑记录

| 日期       | 错误                                                                   | 原因                                                                                                                                                  | 解决                                                                                             |
| ---------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 2026-08-29 | `docker stop nginx` → `No such container: nginx`                  | 把**镜像名**当成了**容器名**。stop/rm 后面要填容器名（NAMES 列），不是镜像名（IMAGE 列）                                                  | 用容器名操作；以后`docker run --name xxx` 自己起名                                             |
| 2026-08-29 | `Exited (0)` 的容器却去 `docker stop`                              | 没看 STATUS 列：`Exited (0)` = 已经自己退出了（0 = 正常）                                                                                           | 已退出的容器用`docker rm` 删除；`stop` 只对 `Up` 的有意义                                  |
| 2026-08-29 | `docker run dify -d name my-dify -p 1234:80` → `这镜像不在白名单` | ①**dify 不是镜像名**——要用 compose 拉起；② 选项写在镜像名后面（顺序错）；③ `name` 少一个横杠                                             | 在`dify/docker` 目录：`cp .env.example .env` → `docker compose up -d`；选项全写镜像名左边 |
| 2026-08-29 | 拉镜像报`这镜像不在白名单 (not in the allowlist)`                    | DaoCloud 镜像源开了白名单模式，只代下载名单内的镜像                                                                                                   | 换一个镜像源（南大/网易等），或接受回源 docker.io                                                |
| 2026-08-29 | PowerShell 里`type nul > index.html` 报错；`touch` 也报错          | `type nul` 是 **CMD** 黑话（nul 是 CMD 的黑洞设备）；PowerShell 里 `type` = `Get-Content`，没有 nul 设备；`touch` 是 **Linux** 的 | PowerShell 创建文件：`"内容" > 文件名` 或 `notepad 文件名`；进 WSL 才能用 touch/vim          |
| 2026-09-13 | `docker build` → `failed to read dockerfile: no such file`        | 站错目录：在 `D:\python-study-map` 敲的，Dockerfile 在 `...\docker-hello\`——`.` 指的是"当前文件夹"，去门口翻当然找不到图纸 | 先 `cd` 进 docker-hello 再 build；`.` = 我现在站的地方，永远记住                           |
| 2026-09-13 | `docker run hello-docker` → `Unable to find image ... 这镜像不在白名单` | **连锁反应**：build 失败了，本地根本没有 hello-docker 镜像 → run 试图去网上下载 → 撞上镜像源白名单。真正病根是上一条 build 失败 | 先修 build 让镜像造出来；白名单报错是"背锅"的，别在它身上浪费功夫                      |
| 2026-09-13 | `COPY requirements.txt` → 文件不存在                              | Dockerfile 里写了 COPY 这个文件，但文件夹里根本没有它 → 快递面单写了"搬这件家具"，屋里没这件家具 | COPY 之前先确认文件真实存在；名字要一字不差（requi**re**ments 容易手滑）                 |
| 2026-09-13 | Dockerfile 里 `RUN pip install requests` + 顺序反了              | ①"当场点名"野路子：每加一个包改一次 Dockerfile，清单就失去了意义；②依赖写代码后面：改一行 app.py → 后面依赖全重装 | 统一走 `pip install -r requirements.txt`；先 COPY 依赖文件装依赖，再 COPY 代码（先依赖后代码） |
| 2026-09-13 | `docker ps -a` 出现一堆没见过的容器（desktop-control-plane 等）  | 那是 **Docker Desktop 自己后台跑的**（kind 集群、镜像代理），不是你造的 | 别去 stop/rm 它们，Docker Desktop 会哭；只认你自己 `--name` 起过名的                 |
| 2026-09-13 | index.html 中文乱码成"鎴戠殑"天书                          | **编码坑**：文件实际是 UTF-8 存的，但 HTML 没写 `<meta charset="UTF-8">` → 浏览器不知道用哪本"密码本"，按中文 Windows 默认的 GBK 猜 → 解出来全是天书 | HTML 头部加 `<meta charset="UTF-8">` 声明；写中文文件用编辑器存 UTF-8，别用 PowerShell `>` 重定向（PowerShell 5 默认写 UTF-16，换环境又是另一种乱码） |
| 2026-09-13 | 所有 docker 命令报 `failed to connect to the docker API at npipe:...` | **Docker Desktop 没在运行**——CLI 和引擎之间靠一根"电话线"（npipe 管道）通信，Desktop 掉线 → 电话线不存在 → 命令再对也白搭。报错和你的命令无关 | 启动 Docker Desktop（托盘鲸鱼图标转圈 → Running），`docker ps` 能列出容器 = 电话线通了；再执行原命令 |
| 2026-09-13 | 终端出现 `>>` 续行符，注释被当成命令                       | 把带 `#` 注释的多段文字整段粘贴进 PowerShell——PowerShell 不认注释里的中文提示，进入等待续行状态 | 粘贴命令前先 Ctrl+C 清掉；只粘贴纯命令行，注释自己心里过一遍就行                     |

> 以后踩了坑，记在这里（同时可以同步到 `notes/errors.md`）。

---

## 第 10 章 待办与待补充

**回忆填充清单（2026-08-29 网课结课，已全部补全 ✅）：**

- [X] 3.3 Dockerfile 指令全表 + ENTRYPOINT vs CMD + .dockerignore + 分层缓存 + push 流程 ✅
- [X] 4.3 run 参数：-e / --name / -it / --rm / --restart always vs unless-stopped ✅
- [X] 5.3 volume 家族补充：prune -a ✅
- [X] 4.6 调试命令：docker top / stats / diff ✅
- [X] 6.4 容器网络：bridge / host / none + network 命令家族 + 自定义 vs 默认 bridge ✅
- [X] 7.4 compose yaml 细节：services 结构 / depends_on / build vs image / -f 指定文件 ✅

**待办：**

- [X] 项目二：海报盖画练习（2026-09-13 完成，含 HTML + 编码坑）✅
- [X] 项目三：hello-docker 自制镜像（2026-09-13 完成，含 pip / requirements.txt 实操）✅
- [ ] 踩坑记录同步到 `notes/errors.md`

**下一步方向：** 学完 Docker 后，为毕设的 Python 数据分析项目写 Dockerfile（打包 pandas 环境），把 Docker 和数据分析串起来。
