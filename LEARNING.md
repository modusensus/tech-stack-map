# My AI Engineering Path
<!-- Managed by the ai-engineering-from-scratch learning skills.
     Repo: https://github.com/rohitg00/ai-engineering-from-scratch -->

## Mission

**动机：做研究 / 论文需要。**

本科城市设计专业，毕业论文方向是城市湿地公园周边的发展案例。目标是通过这门课建立起
「能读懂 AI 论文的方法章节、能判断一个模型的设计是否合理」的能力——而不是转行做 AI 工程师。

终局想做出什么：**还不确定**，先学起来边学边找方向。

起点说明：编程零基础起步，当前正在学 HTML/CSS 前端。日常时间被考研备考占据，
编程相关投入约每周 5 小时。因此本计划刻意做了**范围裁剪**——只保留"读懂论文"必需的主干，
跳过"做产品"方向的阶段。

## Placement

- Date: 2026-09-26
- Score: **7/10**
  - Math & Statistics: 1/2
  - Classical ML: 1/2
  - Deep Learning: 2/2
  - NLP & Transformers: 1/2
  - Applied AI: 2/2
- Entry point: **Phase 1: Math Foundations**
- Pace: ~5 hours/week

**入口点为什么从 Phase 7 下调到 Phase 1：**

测验的机械映射结果是 Phase 7（6-7 分区间）。但学员在 Math & Statistics 第 1 题
（向量点积）上明确表示"点积是什么"，这是 Phase 1 的第一课内容。7 分中有相当部分
来自选择题干扰项过于明显、可用常识排除法蒙对，属于**碎片化常识**而非**系统掌握**。

学员在了解这一矛盾后，主动选择从 Phase 1 从头打地基。此决定由学员本人做出，
本文件如实记录，供后续 `learn` 会话理解上下文。

## Path

| Phase | Name | Status | Est. hours |
|-------|------|--------|------------|
| 0 | Setup & Tooling | Skip | -- |
| 1 | Math Foundations | Do | 23 |
| 2 | ML Fundamentals | Do | 21 |
| 3 | Deep Learning Core | Do | 15 |
| 4 | Computer Vision | Skip | -- |
| 5 | NLP — Foundations to Advanced | Do | 30 |
| 6 | Speech & Audio | Skip | -- |
| 7 | Transformers Deep Dive | Do | 14 |
| 8 | Generative AI | Skip | -- |
| 9 | Reinforcement Learning | Skip | -- |
| 10 | LLMs from Scratch | Skip | -- |
| 11 | LLM Engineering | Skip | -- |
| 12 | Multimodal AI | Skip | -- |
| 13 | Tools & Protocols | Skip | -- |
| 14 | Agent Engineering | Skip | -- |
| 15 | Autonomous Systems | Skip | -- |
| 16 | Multi-Agent & Swarms | Skip | -- |
| 17 | Infrastructure & Production | Skip | -- |
| 18 | Ethics, Safety & Alignment | Skip | -- |
| 19 | Capstone Projects | Skip | -- |

**Total: ~103 hours across 5 phases**（Phase 1 → 2 → 3 → 5 → 7）

按每周 5 小时计算，约 **21 周**（5 个月左右）。

> 关于 Skip 的说明：Phase 4 / 6 / 8-19 标为 Skip，含义是**按当前目标（论文够用）主动跳过**，
> 不代表已经掌握。如果将来目标转向"做 AI 产品"，这 15 个阶段需要重新评估，
> 届时可以用 `find-your-level` 重跑定位，或直接告诉 `start-learning` 重新规划。

### 各阶段学完能得到什么

| 阶段 | 学完你会知道 |
| --- | --- |
| 1 Math Foundations | 点积、矩阵、梯度、概率、贝叶斯——论文里的数学符号不再是天书 |
| 2 ML Fundamentals | 训练/测试集、过拟合、准确率陷阱、超参数 |
| 3 Deep Learning Core | 神经网络怎么学、反向传播、残差连接 |
| 5 NLP | 词的表示、序列模型、注意力 |
| 7 Transformers | 论文里 90% 的"那个架构"到底怎么运作 |

## Progress log

| Date | Lesson | Quiz | Note |
|------|--------|------|------|
| 2026-09-26 | —（完成入学定位） | 7/10 | 入口点定为 Phase 1 |
| 2026-09-26 | Phase 1 / L1: Linear Algebra Intuition（**部分**） | 未测 | 概念部分讲完；`Build It` 代码 + 课后测验待续 |

> **下次从这里继续**：Phase 1 / Lesson 1 —— 还没做 `Build It`（从零写 Vector / Matrix 类）
> 和课后 3 道测验题。可直接说「继续第一课」。

2026-10-09 回归记录：距上次学习间隔 13 天。当日状态疲惫、有挫败感，判断为情绪性停顿而非知识性问题，
故未推进课程。当天未消耗任何课程进度，`Build It` 与课后测验仍按上方标记待续。
下次开场建议走低门槛路线：先用她自己的余弦相似度博客当锚点暖场，再回到代码。

第一课的教学调整记录（供后续会话参考）：

- 学员反馈**类比堆太多反而更糊涂**，要求**定义先行**（正式定义 + 可加性/齐次性这类规范术语），
  类比只作一句话辅助。后续所有课程按此风格：**定义 → 一句话类比 → 避坑**。
- 学员已有的知识锚点：做过记忆工具，熟悉**余弦相似度**（博客 `sycophancy-gating-three-judges`），
  可直接用它解释点积。
- 第一课难度裁剪：线性无关 / 秩 / 投影 / Gram-Schmidt 对零基础过重，已压缩为「了解有这个概念」。
- **可用作教学锚点的自有项目**（2026-10-09 核查公开活动后补充）：
  - `slow-stack/persistbench-sycophancy` —— Jupyter，n=200×2 arms + qwen3:8b + LLM-as-judge，
    核心机制是 **cosine-threshold 记忆门控** → 讲点积/余弦相似度的最佳入口
  - `slow-stack/mneme` —— 跨会话记忆插件（140 stars），含 embedding 与记忆面板 → 讲向量/嵌入的入口
  - `modusensus/laya` —— Python，非自回归 System 1 决策引擎，单次前向传播 → 讲矩阵变换/前向传播的入口
  - `modusensus/ai-governance-compare` —— EU × China AI 与数据法源可溯比对 → 与考研方向、论文方向同域
  教学时应优先用这些"她写过的东西"承载抽象概念，再回到课程示例。

## Review queue

（空。`learn` 会把后续测验中暴露的薄弱点追加到这里。）

定位测验已暴露的待补概念，建议在第一课之前先有印象：

- **向量与点积** —— Math & Statistics Q1 未答出
- **超参数 vs 训练得到的参数** —— Classical ML Q4 答错
- **LoRA 低秩适配** —— NLP & Transformers Q8 答错

第一课（2026-09-26）遗留，下次课开头补：

- **`Build It` 代码 + 课后 3 道测验题** —— 本次未做，没有分数
- **秩 / 线性无关的实际计算** —— 课上标为「了解级」，未做练习；Phase 3 讲神经网络时回补
