"""
AI 工程课 Phase 1 / Lesson 01：线性代数直觉
配套代码：不依赖任何第三方库，用纯 Python 从零实现向量与矩阵。

来源：ai-engineering-from-scratch / phases/01-math-foundations/01-linear-algebra-intuition
说明：本文件是课程的 Build It 环节，用来把"向量是点+箭头""矩阵是变形机器"
      这两句话，变成能真实跑起来的东西。
"""


class Vector:
    """向量：一串有序的数字。

    两个身份：
      1) 空间里的一个点（位置）
      2) 从原点出发的一支箭（有方向、有长度）
    """

    def __init__(self, components):
        # components 是数字序列，例如 [1, 2, 3]
        # 用 list() 复制一份，避免外部改原列表时把向量悄悄改掉
        self.components = list(components)
        # 维数 = 分量的个数，[1,2,3] 的 dim 是 3
        self.dim = len(self.components)

    def __add__(self, other):
        # 向量加法：对应位置相加（可加性的实现）
        # zip 把两个列表按位置配对：(1,4), (2,5), (3,6)
        return Vector([a + b for a, b in zip(self.components, other.components)])

    def __sub__(self, other):
        # 向量减法：对应位置相减
        return Vector([a - b for a, b in zip(self.components, other.components)])

    def __mul__(self, scalar):
        # 数乘：每个分量乘同一个标量（齐次性的实现）
        # 这就是"线性"的第二条规矩：放大输入，输出同比例放大
        return Vector([x * scalar for x in self.components])

    def dot(self, other):
        # 点积：对应位置相乘，再全部加起来，结果是一个数
        # a·b = a1b1 + a2b2 + ... + anbn
        return sum(a * b for a, b in zip(self.components, other.components))

    def magnitude(self):
        # 模（长度）：勾股定理，√(x1² + x2² + ... + xn²)
        return sum(x**2 for x in self.components) ** 0.5

    def normalize(self):
        # 归一化：把向量缩放到长度为 1，只保留方向、丢掉长度
        mag = self.magnitude()
        return Vector([x / mag for x in self.components])

    def cosine_similarity(self, other):
        # 余弦相似度 = 点积 / (两边长度相乘)
        # 范围固定在 -1 到 1，所以比裸点积更适合衡量"像不像"
        # 语义检索、RAG、记忆系统里算的相似度，通常就是它
        return self.dot(other) / (self.magnitude() * other.magnitude())

    def angle_between(self, other):
        # 夹角（角度制）：用反余弦把相似度换算回角度
        import math

        cos_theta = self.cosine_similarity(other)
        # 浮点误差可能让结果变成 1.0000000001，acos 会直接报错，所以先夹住范围
        cos_theta = max(-1.0, min(1.0, cos_theta))
        return math.degrees(math.acos(cos_theta))

    def project_onto(self, other):
        # 投影：把 self 投到 other 这根方向上，得到在 other 上的"影子"
        # 影子长度 = (self·other) / |other|，再乘上 other 的方向
        scalar = self.dot(other) / other.dot(other)
        return Vector([scalar * x for x in other.components])

    def __repr__(self):
        # 决定 print 出来长什么样
        return f"Vector({self.components})"


def is_independent(vectors) -> bool:
    """判断一组向量是否线性无关。

    了解级：本课只需知道"有这么个函数"，不要求会手算。
    做法是高斯消元求秩，秩等于向量个数就说明每个向量都贡献了新维度。
    """
    n = len(vectors)
    if n == 0:
        return True
    dim = vectors[0].dim
    rows = [v.components[:] for v in vectors]
    rank = 0
    for col in range(dim):
        pivot = None
        for row in range(rank, len(rows)):
            if abs(rows[row][col]) > 1e-10:
                pivot = row
                break
        if pivot is None:
            continue
        rows[rank], rows[pivot] = rows[pivot], rows[rank]
        scale = rows[rank][col]
        rows[rank] = [x / scale for x in rows[rank]]
        for row in range(len(rows)):
            if row != rank and abs(rows[row][col]) > 1e-10:
                factor = rows[row][col]
                rows[row] = [rows[row][j] - factor * rows[rank][j] for j in range(dim)]
        rank += 1
    return rank == n


def gram_schmidt(vectors):
    """施密特正交化：把一组向量改造成互相垂直、长度全为 1 的一组。

    了解级：本课不深究，知道它能"把歪的一组方向掰成正交的一组"即可。
    """
    orthonormal = []
    for v in vectors:
        w = v
        for u in orthonormal:
            proj = w.project_onto(u)
            w = w - proj
        if w.magnitude() < 1e-10:
            continue
        orthonormal.append(w.normalize())
    return orthonormal


class Matrix:
    """矩阵：一张数表，数学身份是"线性变换"——一台把向量变成向量的机器。"""

    def __init__(self, rows):
        self.rows = [list(row) for row in rows]
        # shape = (行数, 列数)
        self.shape = (len(self.rows), len(self.rows[0]))

    def __matmul__(self, other):
        # @ 运算符：矩阵 × 矩阵，或 矩阵 × 向量
        # 这也是"神经网络的一层"的核心动作：输入向量 × 权重矩阵 = 输出向量
        if isinstance(other, Vector):
            # 每个输出分量 = 矩阵的第 i 行 与 输入向量 的点积
            return Vector([
                sum(self.rows[i][j] * other.components[j] for j in range(self.shape[1]))
                for i in range(self.shape[0])
            ])
        rows = []
        for i in range(self.shape[0]):
            row = []
            for j in range(other.shape[1]):
                row.append(sum(
                    self.rows[i][k] * other.rows[k][j]
                    for k in range(self.shape[1])
                ))
            rows.append(row)
        return Matrix(rows)

    def transpose(self):
        # 转置：行变列、列变行，形状 (m,n) -> (n,m)
        return Matrix([
            [self.rows[j][i] for j in range(self.shape[0])]
            for i in range(self.shape[1])
        ])

    def rank(self) -> int:
        """秩 = 线性无关的列数 = 这个矩阵真正装了几维有用信息。

        了解级：本课只需理解含义，不要求会手算。
        """
        rows = [row[:] for row in self.rows]
        m, n = self.shape
        r = 0
        for col in range(n):
            pivot = None
            for row in range(r, m):
                if abs(rows[row][col]) > 1e-10:
                    pivot = row
                    break
            if pivot is None:
                continue
            rows[r], rows[pivot] = rows[pivot], rows[r]
            scale = rows[r][col]
            rows[r] = [x / scale for x in rows[r]]
            for row in range(m):
                if row != r and abs(rows[row][col]) > 1e-10:
                    factor = rows[row][col]
                    rows[row] = [rows[row][j] - factor * rows[r][j] for j in range(n)]
            r += 1
        return r

    def __repr__(self):
        return f"Matrix({self.rows})"


if __name__ == "__main__":
    # ===== 今天必须看懂的部分：向量 + 点积 =====
    a = Vector([1, 2, 3])
    b = Vector([4, 5, 6])
    print("=== 向量与点积（今天要懂）===")
    print(f"a = {a}")
    print(f"b = {b}")
    print(f"a + b = {a + b}          # 可加性：对应位置相加")
    print(f"a * 3 = {a * 3}          # 齐次性：整体放大 3 倍")
    print(f"a · b = {a.dot(b)}          # 点积：结果是一个数！1*4+2*5+3*6")
    print(f"|a|   = {a.magnitude():.4f}     # 模：√(1²+2²+3²)")
    print(f"cos(a,b) = {a.cosine_similarity(b):.4f}  # 余弦相似度")

    # 用余弦相似度验证"点积大 = 方向像"
    x = Vector([1, 0])
    y = Vector([0, 1])
    z = Vector([1, 1])
    print("\n=== 方向像不像（今天要懂）===")
    print(f"x·y = {x.dot(y)}  → 0 表示垂直、完全无关")
    print(f"x·z = {x.dot(z)}  → 正数表示同向、有点像")
    print(f"x 与 y 夹角: {x.angle_between(y):.1f}°")
    print(f"x 与 z 夹角: {x.angle_between(z):.1f}°")
    print(f"x 与 x 夹角: {x.angle_between(x):.1f}°")

    # ===== 今天必须看懂的部分：矩阵 = 变形机器 =====
    print("\n=== 矩阵 = 变形机器（今天要懂）===")
    rotation_90 = Matrix([[0, -1], [1, 0]])  # 逆时针旋转 90° 的矩阵
    point = Vector([3, 1])
    print(f"把 {point} 旋转 90° → {rotation_90 @ point}")

    # ===== 了解级：投影 / 线性无关 / 正交化 / 秩 =====
    print("\n=== 了解级（今天不要求懂）===")
    p = Vector([3, 4])
    base = Vector([1, 0])
    proj = p.project_onto(base)
    print(f"投影：{p} 在 {base} 方向上的影子 = {proj}，残差 = {p - proj}")

    e1, e2, e3 = Vector([1, 0, 0]), Vector([0, 1, 0]), Vector([0, 0, 1])
    dep = Vector([2, 1, 0])
    print(f"{{e1,e2,e3}} 线性无关: {is_independent([e1, e2, e3])}")
    print(f"{{e1,e2,2*e1+e2}} 线性无关: {is_independent([e1, e2, dep])}")

    basis = gram_schmidt([Vector([1, 1, 0]), Vector([1, 0, 1]), Vector([0, 1, 1])])
    print(f"正交化后的三个方向: {basis}")
    print(f"它们两两点积（应为 0）: {basis[0].dot(basis[1]):.6f}")

    print("\n=== 秩（了解级，知道含义即可）===")
    print(f"单位矩阵 rank: {Matrix([[1, 0], [0, 1]]).rank()}          # 满秩，信息不冗余")
    print(f"[[1,2],[2,4]] rank: {Matrix([[1, 2], [2, 4]]).rank()}       # 第2行=第1行×2，压扁成1维")

    # ===== 收尾：神经网络的一层就是这个动作 =====
    print("\n=== 神经网络的一层（今天要懂的一句话）===")
    import random

    random.seed(42)
    weights = Matrix([[random.gauss(0, 0.1) for _ in range(3)] for _ in range(2)])
    input_vec = Vector([1.0, 0.5, -0.3])
    output = weights @ input_vec
    print(f"权重矩阵 shape = {weights.shape}")
    print(f"输入 (3维):  {input_vec}")
    print(f"输出 (2维):  {output}")
    print("^ 神经网络的一层，做的就是这件事：进一个向量，乘一个矩阵，出一个新向量。")